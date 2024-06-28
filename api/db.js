const faker = require('faker');
const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 3333;

app.use(cors({
  origin: '*'
}));

app.use(express.json());

const TOTAL_PAGES = 5;

const baseProducts = [
  { name: 'Caneca de cerâmica rústica', description: faker.lorem.paragraph(), image_url: 'https://storage.googleapis.com/xesque-dev/challenge-images/caneca-06.jpg', category: 'mugs' },
  { name: 'Camiseta not today.', description: faker.lorem.paragraph(), image_url: 'https://storage.googleapis.com/xesque-dev/challenge-images/camiseta-05.jpg', category: 't-shirts' },
  { name: 'Caneca Black Ring', description: faker.lorem.paragraph(), image_url: 'https://storage.googleapis.com/xesque-dev/challenge-images/caneca-04.jpg', category: 'mugs' },
  { name: 'Camiseta Broken Saints', description: faker.lorem.paragraph(), image_url: 'https://storage.googleapis.com/xesque-dev/challenge-images/camiseta-03.jpg', category: 't-shirts' },
  { name: 'Camiseta Outcast', description: faker.lorem.paragraph(), image_url: 'https://storage.googleapis.com/xesque-dev/challenge-images/camiseta-06.jpg', category: 't-shirts' },
  { name: 'Caneca The Grounds', description: faker.lorem.paragraph(), image_url: 'https://storage.googleapis.com/xesque-dev/challenge-images/caneca-05.jpg', category: 'mugs' },
  { name: 'Camiseta evening', description: faker.lorem.paragraph(), image_url: 'https://storage.googleapis.com/xesque-dev/challenge-images/camiseta-02.jpg', category: 't-shirts' },
  { name: 'Caneca preto fosco', description: faker.lorem.paragraph(), image_url: 'https://storage.googleapis.com/xesque-dev/challenge-images/caneca-01.jpg', category: 'mugs' },
  { name: 'Caneca Never settle', description: faker.lorem.paragraph(), image_url: 'https://storage.googleapis.com/xesque-dev/challenge-images/caneca-03.jpg', category: 'mugs' },
  { name: 'Camiseta DREAMER', description: faker.lorem.paragraph(), image_url: 'https://storage.googleapis.com/xesque-dev/challenge-images/camiseta-01.jpg', category: 't-shirts' },
  { name: 'Caneca Decaf! P&Co', description: faker.lorem.paragraph(), image_url: 'https://storage.googleapis.com/xesque-dev/challenge-images/caneca-02.jpg', category: 'mugs' },
  { name: 'Camiseta Ramones', description: faker.lorem.paragraph(), image_url: 'https://storage.googleapis.com/xesque-dev/challenge-images/camiseta-04.jpg', category: 't-shirts' },
];

// Simular a geração de produtos
const allProducts = new Array(TOTAL_PAGES).fill(1).reduce((acc) => {
  const products = baseProducts.map(product => ({
    ...product,
    id: faker.datatype.uuid(),
    price_in_cents: faker.datatype.number({
      min: 2000,
      max: 10000,
    }),
    sales: faker.datatype.number(40),
    created_at: faker.date.past(),
  })).sort(() => .5 - Math.random());

  return [...acc, ...products];
}, []);

// Rota raiz
app.get('/', (req, res) => {
  res.send('Welcome to the Products API');
});

// Rota para obter todos os produtos
app.get('/products', (req, res) => {
  const { category, sortField, sortOrder } = req.query;

  // Filtrar por categoria se fornecida
  let filteredProducts = allProducts;
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  // Aplicar filtro de prioridade se fornecida
  if (sortField && sortOrder) {
    filteredProducts.sort((a, b) => {
      if (sortOrder === 'ASC') {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else if (sortOrder === 'DESC') {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
      return 0;
    });
  }

  res.json(filteredProducts);
});

// Rota para obter um produto pelo ID
app.get('/product', (req, res) => {
  const { id } = req.query;
  const product = allProducts.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

// Rota para criar novos produtos (não foi alterada)
app.post('/products', (req, res) => {
  const { name, description, image_url, category, price_in_cents, sales } = req.body;

  if (!name || !description || !image_url || !category || !price_in_cents || !sales) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newProduct = {
    id: faker.datatype.uuid(),
    name,
    description,
    image_url,
    category,
    price_in_cents,
    sales,
    created_at: new Date(),
  };

  allProducts.push(newProduct);
  res.status(201).json(newProduct);
});

// Iniciar o servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
