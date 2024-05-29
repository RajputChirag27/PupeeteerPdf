import express from "express";
import fs from 'fs';
import path, { format } from 'path';
import { fileURLToPath } from 'url';
import convertHTMLToPDF from "pdf-puppeteer";
import puppeteer from 'puppeteer'
const app = express();
const port = process.env.PORT || 3000;

//View Engine
// app.set("view engine", "hbs");


// These Values comes from DB
const pdfObject = {
  name: "John Doe",
  age: 30,
  email: "johndoe@xyz.com",
};

// const orders = [
//   {
//     product: "Fan",
//     description: "Pankha for Kota Students",
//     quantity: 1,
//     amount: 3999,
//   },
//   {
//     product: "Sasta Fan",
//     description: "Sasta pankha",
//     quantity: 1,
//     amount: 399,
//   }
// ];
const products = [
  { product: "Fan", description: "Pankha for Kota Students", amount: 3999 },
  { product: "Sasta Fan", description: "Sasta pankha", amount: 399 },
  { product: "Air Conditioner", description: "AC for cool breeze", amount: 25000 },
  { product: "Heater", description: "Room Heater", amount: 5000 },
  { product: "Cooler", description: "Air Cooler", amount: 6000 }
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomOrder() {
  const product = products[getRandomInt(0, products.length - 1)];
  return {
    product: product.product,
    description: product.description,
    quantity: getRandomInt(1, 5), // random quantity between 1 and 5
    amount: product.amount
  };
}

const orders = [];

for (let i = 0; i < 100; i++) {
  orders.push(generateRandomOrder());
}

// Total Order Amount Calculator

const totalPrice = orders.reduce((acc, order) => acc + order.amount, 0);

//   Html File passed to pdf puppeeteer
const html = `
  <!doctype html>
  <html lang="en">
    <head>
      <title>Invoice PDF</title>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous" />
      <style>
        .text-center {
          text-align: center;
        }
        .page-break {
          page-break-before: always;
        }
      </style>
    </head>
    <body>
      <header>
      </header>
      <main>
    <div class="container">
    <h3>Order Details</h3>
    </div>
        <div class="table-responsive container">
          <table class="table table-black table-striped">
            <thead>
              <tr class="">
                <th scope="col">Product</th>
                <th scope="col">Description</th>
                <th scope="col">Quantity</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${orders.map(order => `
                <tr>
                  <td>${order.product}</td>
                  <td>${order.description}</td>
                  <td>${order.quantity}</td>
                  <td>${order.amount}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <th>Total:</th>
                <th></th>
                <th></th>
                <th>$${totalPrice}</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </main>
      <footer>
      </footer>
    </body>
  </html>
`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes 

app.get("/pdfPuppet", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true, // run in headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // necessary for some environments
    });
    const page = await browser.newPage();

    // const html = "<html><body><h1>Hello, Puppeteer!</h1></body></html>"; // Replace with your actual HTML content

    await page.setContent(html, { waitUntil: 'networkidle0' });

    await page.pdf({
      path: 'users.pdf',
      format: 'A4',
      printBackground: true,
      margin: {
        top : 230,
        bottom : 50,
        left : 10,
        right : 10
      },
      displayHeaderFooter: true,
      displayHeaderFooter: true,
      headerTemplate: `
        <style>
          .header {
            font-size: 15px;
            width: 100%;
            margin-left: 60px ;
          }
          .text-center{
            text-align : center;
          }
        </style>
        <div class="header">
          <h1 class="text-center mt-3">Invoice PDF</h1>
          <div class="container">
            <h3 class="mt-5">Customer Details</h3>
            <div class="container mt-5">
              <p><strong>Customer Name</strong>: ${pdfObject.name}</p>
              <p><strong>Customer Age</strong>: ${pdfObject.age}</p>
              <p><strong>Customer Email</strong>: ${pdfObject.email}</p>
            </div>
          </div>
        </div>
      `,
      footerTemplate: `
        <style>
          .footer {
            font-size: 12px;
            width: 100%;
            text-align: center;
            margin: 0;
          }
        </style>
        <div class="footer">
          <p>Page <span class="pageNumber"></span> of <span class="totalPages"></span></p>
        </div>
      `,
    });

    await browser.close();
    res.setHeader("Content-Type", "application/pdf");
    res.sendFile('users.pdf', { root: __dirname });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).send('Error generating PDF');
  }
});



app.get("/pdf", async (req, res) => {
  try {
    await convertHTMLToPDF(html, async (pdf) => {
      // Save PDF to a file
      const filePath = path.join(__dirname, 'invoice.pdf');
      await fs.promises.writeFile(filePath, pdf);

      // Send PDF as a response
      res.setHeader("Content-Type", "application/pdf");
      res.send(pdf);
    });
  } catch (error) {
    console.error('Error generating or writing PDF:', error);
    res.status(500).send('Internal Server Error');
  }
});



// Listening to the server

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});


