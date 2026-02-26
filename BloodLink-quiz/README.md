# BloodLink

Aplicacao desktop em Tauri + React + TypeScript para gerir reservas de sangue, postos, brigadas moveis e perfil de doador. Enquanto a API oficial nao esta disponivel sao utilizados dados mock nas camadas de servicos.

## Funcionalidades

- Autenticacao via Firebase Auth (placeholders de configuracao incluidos em `.env.example`).
- Roteamento protegido com React Router (`/login`, `/home`, `/reservas`, `/postos`, `/brigadas`, `/perfil`).
- Componentes dedicados (`Navbar`, `ProtectedRoute`) e hooks reutilizaveis (`useAuth`, `useApi`).
- Servico `api.ts` com dados mock para reservas, postos, brigadas e elegibilidade.
- Estilos globais customizados localizados em `src/styles/globals.css`.

## Preparacao do ambiente

1. Instale as dependencias do frontend e de Tauri:
	 ```bash
	 npm install
	 ```
2. Crie um ficheiro `.env` na raiz a partir do `.env.example` e preencha **tanto** as variaveis sem prefixo como as que comecam por `VITE_` (o frontend utiliza estas ultimas para expor os valores ao browser).
3. Configure o Firebase Auth com email/password e actualize os valores no `.env`.
4. Garanta que Rust e as restantes dependencias Tauri estao instaladas: <https://tauri.app/start/prerequisites/>.

## Scripts utiles

- `npm run dev` — inicia o frontend em modo Vite standalone.
- `npm run tauri dev` — executa a aplicacao desktop Tauri.
- `npm run build` — gera build de producao do frontend.
- `npm run tauri build` — cria binarios desktop.

## Rotas disponiveis (localhost:1420)

### Publicas (sem login)

| Rota | Descricao |
|---|---|
| [http://localhost:1420/](http://localhost:1420/) | Pagina inicial publica (reservas + brigadas) |
| [http://localhost:1420/reservas](http://localhost:1420/reservas) | Niveis de reservas de sangue |
| [http://localhost:1420/brigadas](http://localhost:1420/brigadas) | Agenda de brigadas moveis |
| [http://localhost:1420/quiz](http://localhost:1420/quiz) | Quiz "Posso Doar?" |
| [http://localhost:1420/educacao](http://localhost:1420/educacao) | Conteudos educativos sobre doacao |
| [http://localhost:1420/login](http://localhost:1420/login) | Login |
| [http://localhost:1420/register](http://localhost:1420/register) | Criar conta |

### Privadas (requerem login)

| Rota | Descricao |
|---|---|
| [http://localhost:1420/dashboard](http://localhost:1420/dashboard) | Dashboard do dador (perfil, historico, pontos) |
| [http://localhost:1420/perfil](http://localhost:1420/perfil) | Perfil do utilizador |
| [http://localhost:1420/historico](http://localhost:1420/historico) | Historico de dadivas |
| [http://localhost:1420/gamificacao](http://localhost:1420/gamificacao) | Pontos e medalhas |
| [http://localhost:1420/notificacoes](http://localhost:1420/notificacoes) | Notificacoes personalizadas |

> As rotas privadas redirecionam para `/login` se nao existir sessao ativa.

## Estrutura principal

```
src/
	app/
		components/
		hooks/
		pages/
		services/
	styles/
public/
src-tauri/
```

## Notas

- Os servicos `api.ts` e `firebase.ts` usam dados mock e placeholders ate a integracao real.
- O componente `ProtectedRoute` redirecciona automaticamente para `/login` quando nao existe sessao valida.
- A navegacao e apresentada apenas quando o utilizador esta autenticado.
