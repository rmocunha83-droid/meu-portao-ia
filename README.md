# Meu Portão IA

MVP navegável para visualizar estilos de portões em fachadas e captar pedidos de orçamento.

Site publicado: https://meu-portao-ia.vercel.app

## Backend

O MVP usa Convex para salvar:

- pedidos de orçamento dos moradores
- cadastros de empresas parceiras

As fotos enviadas no simulador continuam apenas no navegador nesta versão.

Para produção, configure `VITE_CONVEX_URL` na Vercel com a URL da implantação Convex cloud.

## Rodar localmente

1. Instale as dependências:
   `npm install`
2. Configure o Convex:
   `npx convex dev --once`
3. Inicie o projeto:
   `npm run dev`
4. Abra o endereço exibido no terminal.

## Páginas

- `/` - Landing page
- `/simular` - Upload, preferências, geração simulada e formulário de lead
- `/empresas` - Benefícios, planos e cadastro de parceiros
- `/privacidade` - Política de privacidade do MVP

O código contém pontos preparados para futuras integrações de geração de imagem, storage de fotos e CRM.
