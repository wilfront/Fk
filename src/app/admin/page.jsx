'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// Se você tem um arquivo admin.css na mesma pasta, ele é carregado
import './admin.css'; 

export default function AdminPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // 🚨 NOVO ESTADO: Armazena o objeto File selecionado, não a URL.
  const [selectedFile, setSelectedFile] = useState(null); 
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: 'canecas-tematicas',
    imagem: '', // Esta será a URL final do Cloudinary, salva no Firestore
  });

  useEffect(() => {
    // 💡 IMPORTANTE: Substitua 'confirm' por um modal customizado, pois 'confirm' não funciona em todos os ambientes.
    // Usei alert() e confirm() como fallback simples, mas recomendo criar um modal.
    if (typeof window !== 'undefined' && !window.confirm) {
        window.confirm = (message) => console.warn("Usando fallback para confirm:", message);
    }
    if (typeof window !== 'undefined' && !window.alert) {
        window.alert = (message) => console.warn("Usando fallback para alert:", message);
    }
    
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.push("/admin/login");
    } else {
      setIsLoading(false);
      fetchProdutos();
    }
  }, [router]);

  async function fetchProdutos() {
    try {
      const res = await fetch('/api/products');
      
      if (!res.ok) {
        throw new Error(`Erro na API: ${res.statusText}`);
      }
      
      const data = await res.json();
      setProdutos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    }
  }

  // 🚨 CORREÇÃO: Esta função AGORA APENAS ARMAZENA O ARQUIVO NO ESTADO.
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    // Limpa a URL antiga se estivermos editando e um novo arquivo for selecionado
    setFormData(prev => ({ ...prev, imagem: '' }));
  }

  // Função para carregar o arquivo para o Cloudinary
  async function uploadToCloudinary(file) {
      setUploadingImage(true);
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

      try {
          const res = await fetch(
              `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
              {
                  method: 'POST',
                  body: formDataUpload,
              }
          );

          const data = await res.json();
          setUploadingImage(false);
          
          if (!res.ok || data.error) {
              throw new Error(data.error?.message || 'Falha no upload do Cloudinary');
          }
          
          return data.secure_url;
      } catch (err) {
          console.error('Erro no upload:', err);
          setUploadingImage(false);
          alert('Erro ao fazer upload da imagem. O produto não será salvo.');
          throw err; // Lança o erro para interromper o salvamento no Firestore
      }
  }

  async function handleSaveProduto() {
    // 1. VALIDAÇÃO
    if (!formData.nome || !formData.descricao || !formData.preco || (!formData.imagem && !selectedFile)) {
      alert('Preencha todos os campos, incluindo a imagem.');
      return;
    }

    let finalFormData = { ...formData };
    
    // 2. LÓGICA CONDICIONAL DE UPLOAD
    if (selectedFile) {
        try {
            const imageUrl = await uploadToCloudinary(selectedFile);
            finalFormData.imagem = imageUrl;
            // Limpa o arquivo selecionado após o sucesso do upload
            setSelectedFile(null); 
        } catch (error) {
            // O erro já foi tratado e alertado dentro de uploadToCloudinary
            return; 
        }
    }
    
    // Se estiver editando e não houver novo arquivo, usa a URL existente (formData.imagem)
    if (!finalFormData.imagem) {
        alert('A imagem é obrigatória.');
        return;
    }

    // 3. SALVAMENTO NO FIRESTORE (via API)
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/products/${editingId}` : '/api/products';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalFormData),
      });

      if (res.ok) {
        alert(editingId ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
        fetchProdutos(); // Atualiza a lista para mostrar o novo produto
        setShowForm(false);
        setEditingId(null);
        setFormData({ nome: '', descricao: '', preco: '', categoria: 'canecas-tematicas', imagem: '' });
      } else {
          const errorData = await res.json();
          console.error('Erro da API ao salvar:', errorData.message);
          alert(`Erro da API ao salvar produto: ${errorData.message}. Verifique o console do backend.`);
      }
    } catch (err) {
      console.error('Erro de conexão ao salvar:', err);
      alert('Erro de conexão ao salvar produto.');
    }
  }

  function handleEdit(produto) {
    // Se for editar, preenche o formulário com a URL existente
    setFormData(produto);
    setEditingId(produto.id);
    setShowForm(true);
    setSelectedFile(null); // Garante que nenhum arquivo antigo está pendente
  }

  // 🚨 CORREÇÃO: Usando window.confirm
  async function handleDelete(id) {
    if (window.confirm('Tem certeza que quer deletar?')) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (res.ok) {
          alert('Produto deletado!');
          fetchProdutos();
        } else {
            const errorData = await res.json();
            alert(`Erro ao deletar: ${errorData.message}`);
        }
      } catch (err) {
        console.error('Erro ao deletar:', err);
        alert('Erro de conexão ao deletar.');
      }
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      localStorage.removeItem("adminToken");
      router.push("/admin/login");
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  }

  if (isLoading) return <div className="loading">Carregando...</div>;

  const currentImagePreview = selectedFile 
    ? URL.createObjectURL(selectedFile) // Mostra o arquivo selecionado
    : formData.imagem; // Mostra a URL existente (para edição)

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Painel Administrativo</h1>
        <div className="admin-header-info">
          <div className="admin-user-info">
            <p>Bem-vindo!</p>
            <p className="username">Administrador</p>
          </div>
          <button 
            onClick={handleLogout}
            className="admin-logout-btn"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="admin-content">
        <h2>Gerenciar Produtos</h2>

        <button 
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null); // Limpa o ID de edição ao fechar/abrir
            setSelectedFile(null); // Limpa o arquivo
            setFormData({ nome: '', descricao: '', preco: '', categoria: 'canecas-tematicas', imagem: '' });
          }}
          style={{
            padding: '10px 20px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom: '10px',
            fontWeight: 'bold'
          }}
        >
          {showForm ? '✕ Cancelar' : '➕ Novo Produto'}
        </button>

        {showForm && (
          <div style={{
            background: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px',
          }}>
            <h3>{editingId ? 'Editar Produto' : 'Novo Produto'}</h3>
            
            <input
              type="text"
              placeholder="Nome do Produto"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              // ... (estilo)
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
            />

            <textarea
              placeholder="Descrição"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              // ... (estilo)
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box', minHeight: '100px' }}
            />

            <input
              type="number"
              placeholder="Preço"
              // Garante que o valor é tratado como string para o input, mas o salvamento usa float
              value={formData.preco} 
              onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
              // ... (estilo)
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
            />

            <select
              value={formData.categoria}
              onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
              // ... (estilo)
              style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' }}
            >
              <option value="canecas-tematicas">Canecas Temáticas</option>
              <option value="dia-das-criancas">Dia das Crianças</option>
              <option value="dia-dos-professores">Dia dos Professores</option>
              <option value="datas-comemorativas">Datas Comemorativas</option>
              <option value="pronta-entrega">Pronta Entrega</option>
              <option value="personalize">Personalize</option>
            </select>

            <div style={{
              marginBottom: '15px',
              padding: '15px',
              border: '2px dashed #667eea',
              borderRadius: '5px',
              textAlign: 'center',
            }}>
              {/* 🚨 CORREÇÃO: Chama handleFileChange, que SÓ armazena o arquivo */}
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange} 
                disabled={uploadingImage}
              />
              {uploadingImage && <p>Enviando imagem para Cloudinary...</p>}
              {/* Mostra preview da imagem nova ou da URL antiga */}
              {currentImagePreview && (
                <div>
                  <img src={currentImagePreview} alt="preview" style={{
                    maxWidth: '200px',
                    marginTop: '10px',
                    borderRadius: '5px',
                  }} />
                  <p>{selectedFile ? 'Nova imagem selecionada ✓' : 'Imagem existente ✓'}</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleSaveProduto}
              disabled={uploadingImage} // Desabilita enquanto o upload está em andamento
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: uploadingImage ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                opacity: uploadingImage ? 0.7 : 1,
              }}
            >
              {uploadingImage ? 'Salvando... (Aguarde o upload)' : 'Salvar Produto'}
            </button>
          </div>
        )}

        <h3>Produtos Cadastrados ({produtos.length})</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
        }}>
          {produtos.map((p) => (
            <div key={p.id} style={{
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}>
              <img 
                src={p.imagem} 
                alt={p.nome} 
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/200x200/cccccc/333333?text=Sem+Imagem'; }}
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                }} 
              />
              <div style={{ padding: '15px' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>{p.nome}</h4>
                <p style={{ fontSize: '13px', color: '#666', margin: '0 0 10px 0' }}>
                  {p.descricao?.substring(0, 50) || 'Sem descrição'}...
                </p>
                <p style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#667eea',
                  margin: '0 0 10px 0',
                }}>
                  R$ {typeof p.preco === 'number' ? p.preco.toFixed(2) : parseFloat(p.preco || 0).toFixed(2)}
                </p>
                <p style={{ fontSize: '12px', color: '#999', margin: '0 0 15px 0' }}>
                  Categoria: {p.categoria}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleEdit(p)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(p.id)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}