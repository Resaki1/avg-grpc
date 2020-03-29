import grpc from "grpc";
import protoLoader from "@grpc/proto-loader";
import path from "path";
const search = "suche";
const packageDefinition = protoLoader.loadSync(path.join(path.resolve(), "suppliers.proto"));
const SupplierService = grpc.loadPackageDefinition(packageDefinition).suppliers.SupplierService;
const client = new SupplierService("127.0.0.1:50051", grpc.credentials.createInsecure());
client.findAllPreferredSuppliers(search, (error,response) => {
    if (!error) {
        console.log("All preferred suppliers " , response);
    } else {
        console.log("Error", error.message);
    }
})
client.findPreferredSupplier({id: 1}, (error, response) => {
    if (!error) { 
        console.log("Found product: ", response);
    } else {
        console.log("Error", error.message);
    } 
})
client.setPreferredSupplierForProduct({ productID: 1, supplierName: "Nike" }, (error, response) => {
    if (!error) {
        console.log("It worked", response);
    } else {
        console.log(error.details);
    }
})