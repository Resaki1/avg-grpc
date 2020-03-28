import grpc from "grpc";
import protoLoader from "@grpc/proto-loader";
import { products } from "../data/products.js";
import path from "path";

const findAllPreferredSuppliers = () =>
  products.map(product => product.preferredSupplier);
const findPreferredSupplier = productID =>
  products
    .filter(product => product.id === productID)
    .map(product => product.preferredSupplier);
const setPreferredSupplierForProduct = (productID, supplier) => {
  const product = products.filter(product => product.id === productID);
  if (product) {
    product.preferredSupplier = supplier;
    return true;
  }
  return false;
};
// localhost
const CONNECT_IP = "127.0.0.1";
const CONNECT_PORT = "50051";

const packageDefinition = protoLoader.loadSync(path.join(path.resolve(), "suppliers.proto"));
const protoFile = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
server.addProtoService(protoFile.suppliers.SupplierService.service, {
  findAllPreferredSuppliers(_, callback) {
    callback(null, { names: findAllPreferredSuppliers()})
  },
  findPreferredSupplier(call, callback) {
    callback(null, findPreferredSupplier(call.id))
  },
  setPreferredSupplierForProduct(call, callback) {
    const { productID, supplier } = call;
    const result = setPreferredSupplierForProduct(productID, supplier);
    callback(null, result)
  }
})
server.bind(
  `${CONNECT_IP}:${CONNECT_PORT}`,
  grpc.ServerCredentials.createInsecure()
);
console.log(`Server running at ${CONNECT_IP}:${CONNECT_PORT}`);
server.start();
