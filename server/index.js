import grpc from "grpc";
import protoLoader from "@grpc/proto-loader";
import { products, suppliers } from "../data/products.js";
import path from "path";

const findAllPreferredSuppliers = () =>
  products.map((product) => product.preferredSupplier);
const findPreferredSupplier = (productID) =>
  products
    .filter((product) => product.id === productID)
    .map((product) => product.preferredSupplier);
const setPreferredSupplierForProduct = (productID, supplierName) => {
  const product = products.filter((product) => product.id === productID);
  const supplier = suppliers.filter(supplier => supplier.name === supplierName);
  if (product.length === 1 && supplier.length === 1) {
    product.preferredSupplier = supplier.name;
    return true;
  }
  return {code: 2, name:"Unknown", details: supplier.length === 0 ? "UnknownSupplier" : "UnknownProduct" };
};
// localhost
const CONNECT_IP = "127.0.0.1";
const CONNECT_PORT = "50051";

const packageDefinition = protoLoader.loadSync(
  path.join(path.resolve(), "suppliers.proto")
);
const protoFile = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
server.addService(protoFile.suppliers.SupplierService.service, {
  findAllPreferredSuppliers(_, callback) {
    callback(null, { names: findAllPreferredSuppliers() });
  },
  findPreferredSupplier(call, callback) {
    callback(null, { name: findPreferredSupplier(call.request.id) });
  },
  setPreferredSupplierForProduct(call, callback) {
    const { productID, supplierName } = call.request;
    console.log(call.request); 
    const result = setPreferredSupplierForProduct(productID, supplierName);
    if (result === true) {
      callback(null, { isSet: result });
    } else {
      callback(result);
    }
  },
});
server.bind(
  `${CONNECT_IP}:${CONNECT_PORT}`,
  grpc.ServerCredentials.createInsecure()
);
console.log(`Server running at ${CONNECT_IP}:${CONNECT_PORT}`);
server.start();
