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
