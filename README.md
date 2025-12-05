# Sistema de Gerenciamento de Demandas - Produção e Manutenção

Este é um sistema web completo para gerenciamento de demandas, ordens de serviço e aprovações entre os setores de Produção e Manutenção. O sistema permite a abertura de chamados, fluxo de aprovação em múltiplos níveis, execução de tarefas e acompanhamento via quadros Kanban e Dashboards.

## 🚀 Tecnologias Utilizadas

### Backend
- **Linguagem**: Python 3.10+
- **Framework**: Flask 3.0
- **ORM**: SQLAlchemy (com Flask-SQLAlchemy)
- **Autenticação**: JWT (Flask-JWT-Extended)
- **Banco de Dados**: SQLite (Desenvolvimento) / MySQL (Produção)
- **Outros**: Flask-Migrate, Flask-Cors

### Frontend
- **Linguagem**: JavaScript (ES6+)
- **Framework**: React 18
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS
- **Roteamento**: React Router DOM
- **Ícones**: Heroicons (via SVG)

---

## ✨ Melhorias e Arquitetura

O projeto passou por refatorações recentes para garantir escalabilidade, performance e usabilidade:

### 1. Arquitetura em Camadas (Service Layer)
A lógica de negócios foi desacoplada das rotas (Controllers) e movida para uma camada de serviço dedicada (`backend/services/`).
- **Benefício**: Código mais limpo, testável e reutilizável. As rotas apenas lidam com HTTP, enquanto os serviços lidam com as regras da aplicação.

### 2. Paginação Eficiente
Implementação de paginação real no banco de dados (`SQLAlchemy pagination`).
- **Antes**: O sistema carregava TODAS as demandas e filtrava no Python.
- **Agora**: O banco retorna apenas a página solicitada (ex: 10 itens), reduzindo drasticamente o uso de memória e tempo de resposta.

### 3. Design Responsivo (Mobile/Tablet)
O layout foi adaptado para funcionar perfeitamente em dispositivos móveis e tablets.
- **Sidebar Inteligente**: Em telas grandes, o menu é fixo. Em telas menores (Tablets/Celulares), ele se torna uma "gaveta" acessível via menu hambúrguer, liberando espaço para o conteúdo.

---

## 🛠️ Como Rodar o Projeto

### Pré-requisitos
- Python 3.x
- Node.js & npm

### 1. Backend
```bash
cd backend
# Instalar dependências
pip install -r requirements.txt
# Rodar servidor
python app.py
```
O servidor rodará em `http://127.0.0.1:5000`.

### 2. Frontend
```bash
cd frontend
# Instalar dependências
npm install
# Rodar servidor de desenvolvimento
npm run dev
```
O frontend rodará em `http://localhost:5173`.

---

## 🗄️ Configuração de Banco de Dados (SQLite vs MySQL)

Por padrão, o projeto vem configurado para usar **SQLite**, que é excelente para desenvolvimento pois não requer instalação de servidor de banco de dados (o banco é apenas um arquivo `.db`).

Para produção ou ambientes mais robustos, recomenda-se migrar para **MySQL**.

### Como migrar para MySQL

1.  **Pré-requisitos**: Tenha um servidor MySQL rodando e crie um banco de dados vazio (ex: `demandas_db`).

2.  **Instalar Driver**:
    Certifique-se de que o driver do MySQL está instalado no Python (já está no `requirements.txt` como `PyMySQL`).

3.  **Configurar Variável de Ambiente**:
    O sistema usa a variável de ambiente `DATABASE_URL` para definir o banco.

    **No Windows (PowerShell):**
    ```powershell
    $env:DATABASE_URL="mysql+pymysql://USUARIO:SENHA@LOCALHOST:3306/NOME_DO_BANCO"
    ```

    **No Linux/Mac:**
    ```bash
    export DATABASE_URL="mysql+pymysql://usuario:senha@localhost:3306/nome_do_banco"
    ```

    *Substitua `usuario`, `senha`, `localhost` e `nome_do_banco` pelos seus dados reais.*

4.  **Atualizar `config.py` (Opcional/Hardcoded)**:
    Se preferir não usar variáveis de ambiente (não recomendado para senhas), você pode editar o arquivo `backend/config.py`:

    ```python
    # backend/config.py
    
    # Comente a linha do SQLite
    # SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
    
    # Descomente e preencha a do MySQL
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:senha123@localhost/demandas_db'
    ```

5.  **Rodar Migrações**:
    Ao trocar de banco, você precisa criar as tabelas novamente.
    ```bash
    cd backend
    flask db upgrade
    ```
    *Nota: Se der erro de conflito, pode ser necessário apagar a pasta `migrations` e rodar `flask db init`, `flask db migrate` e `flask db upgrade` novamente.*

---

## 👥 Usuários Padrão (Desenvolvimento)

Para acessar o sistema, você pode criar um superusuário rodando:
```bash
cd backend
python create_superuser.py
```
Isso criará/verificará o usuário com HMC `37100655` e senha `admin123#`.
