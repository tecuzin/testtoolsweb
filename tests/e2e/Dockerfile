FROM mcr.microsoft.com/playwright:v1.58.2-jammy
WORKDIR /app
COPY package.json package-lock.json tsconfig.base.json ./
COPY tests/e2e/package.json ./tests/e2e/package.json
RUN npm ci --workspaces
COPY . .
CMD ["npm", "run", "test", "--workspace", "tests/e2e"]
