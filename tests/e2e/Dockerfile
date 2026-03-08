FROM mcr.microsoft.com/playwright:v1.48.2-jammy
WORKDIR /app
COPY package.json tsconfig.base.json ./
COPY tests/e2e/package.json ./tests/e2e/package.json
RUN npm install --workspaces
COPY . .
CMD ["npm", "run", "test", "--workspace", "tests/e2e"]
