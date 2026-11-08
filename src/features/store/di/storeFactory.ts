import { StoreRepositoryImpl } from "../infrastructure/api/StoreRepositoryImpl";
import {
  CreateOrderUseCase,
  CreateProductUseCase,
  DownloadProductPdfUseCase,
  GetMyEntitlementsUseCase,
  GetProductByIdUseCase,
  GetProductsUseCase,
  InitiateKhaltiPaymentUseCase,
  UploadProductPdfUseCase,
  VerifyKhaltiPaymentUseCase,
} from "../domain/useCases";

const storeRepository = new StoreRepositoryImpl();

export const getProductsUseCase = new GetProductsUseCase(storeRepository);
export const getProductByIdUseCase = new GetProductByIdUseCase(storeRepository);
export const createOrderUseCase = new CreateOrderUseCase(storeRepository);
export const initiateKhaltiPaymentUseCase =
  new InitiateKhaltiPaymentUseCase(storeRepository);
export const verifyKhaltiPaymentUseCase =
  new VerifyKhaltiPaymentUseCase(storeRepository);
export const getMyEntitlementsUseCase =
  new GetMyEntitlementsUseCase(storeRepository);
export const createProductUseCase = new CreateProductUseCase(storeRepository);
export const uploadProductPdfUseCase =
  new UploadProductPdfUseCase(storeRepository);
export const downloadProductPdfUseCase =
  new DownloadProductPdfUseCase(storeRepository);
