const request = require('supertest');


it('products route should return forbidden when not authentificated', async done => {
  await request(strapi.server) // app server is an instance of Class: http.Server
    .get('/products')
    .expect(403)
  done();
});

it('carts route should return forbidden when not authentificated', async done => {
  await request(strapi.server) // app server is an instance of Class: http.Server
    .get('/carts')
    .expect(403)
  done();
});

it('post a product in cart should return forbidden when not authentificated', async done => {
  await request(strapi.server) // app server is an instance of Class: http.Server
    .post('/carts')
    .send({
      products: [1],
      products_options: JSON.stringify({}),
    })
    .expect(403) // Expect response http code 200
  done();
});
