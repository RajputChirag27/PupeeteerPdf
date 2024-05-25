import express from "express";
import convertHTMLToPDF from "pdf-puppeteer";

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
  
  const orders = [
    {
      product: "Fan",
      description: "Pankha Latakne Ke liye",
      quantity: 1,
      amount: 3999,
    },
    {
      product: "Sasta Fan",
      description: "Sasta pankha",
      quantity: 1,
      amount: 399,
    }
  ];

  // Total Order Amount Calculator
  
  const totalPrice = orders.reduce((acc, order) => acc + order.amount, 0);
  
//   Html File passed to pdf puppeeteer
  const html = `
  <!doctype html>
  <html lang="en">
    <head>
      <title>Title</title>
      <!-- Required meta tags -->
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <!-- Bootstrap CSS v5.2.1 -->
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossorigin="anonymous"
      />
    </head>
    <body>
      <header>
        <!-- place navbar here -->
      </header>
      <main>
        <h1 class="text-center mt-3">Invoice Pdf</h1>
        <div class="container">
          <h3 class="mt-5">Customer Details</h3>
          <div class="container mt-5">
            <p><strong>CustomerName</strong>: ${pdfObject.name}</p>
            <p><strong>CustomerAge</strong>: ${pdfObject.age}</p>
            <p><strong>CustomerEmail</strong>: ${pdfObject.email}</p>
          </div>
        </div>
        <div class="table-responsive mt-5 container">
          <table class="table table-black table-striped">
            <thead>
              <tr>
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
        <!-- place footer here -->
      </footer>
      <!-- Bootstrap JavaScript Libraries -->
      <script
        src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js"
        integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r"
        crossorigin="anonymous"
      ></script>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"
        integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+"
        crossorigin="anonymous"
      ></script>
    </body>
  </html>`;
  
  
// Routes 


app.get("/pdf", async (req, res) => {
  await convertHTMLToPDF(html, (pdf) => {
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdf);
  });
});


// Listening to the server

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});


