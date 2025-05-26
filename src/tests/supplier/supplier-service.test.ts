
import { supplierService } from '@/services/supplier/service';
import * as api from '@/services/supplier/api';
import { SupplierCreateData, SupplierData } from '@/types/supplier-types';

// Mock the supplier API
jest.mock('@/services/supplier/api');

describe('Supplier Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSupplier: SupplierCreateData = {
    supplier_name: 'Test Supplier',
    supplier_type: 'service',
    status: 'active',
    abn: '12345678901',
    contact_person: 'John Doe',
    email: 'john@example.com',
    phone: '0412345678'
  };

  const mockSupplierResponse = {
    data: {
      id: '123e4567-e89b-12d3-a456-426614174003',
      business_name: 'Test Supplier',
      supplier_type: 'service',
      status: 'active',
      abn: '12345678901',
      primary_contact_name: 'John Doe',
      primary_contact_email: 'john@example.com',
      primary_contact_phone: '0412345678',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } as SupplierData,
    message: 'Supplier created successfully'
  };

  test('createSupplier - success case', async () => {
    // Mock successful response
    (api.createSupplier as jest.Mock).mockResolvedValueOnce(mockSupplierResponse);
    
    const result = await supplierService.createSupplier(mockSupplier);

    expect(api.createSupplier).toHaveBeenCalledWith(mockSupplier);
    expect(result).toEqual(mockSupplierResponse);
  });

  test('getAllSuppliers - success case', async () => {
    // Mock successful response
    (api.getAllSuppliers as jest.Mock).mockResolvedValueOnce({ 
      data: [mockSupplierResponse.data],
      message: 'Suppliers fetched successfully'
    });

    const result = await supplierService.getAllSuppliers();

    expect(api.getAllSuppliers).toHaveBeenCalled();
    expect(result).toEqual({ 
      data: [mockSupplierResponse.data],
      message: 'Suppliers fetched successfully'
    });
  });

  test('getSupplierById - success case', async () => {
    // Mock successful response
    (api.getSupplierById as jest.Mock).mockResolvedValueOnce(mockSupplierResponse);

    const supplierId = '123e4567-e89b-12d3-a456-426614174003';
    const result = await supplierService.getSupplierById(supplierId);

    expect(api.getSupplierById).toHaveBeenCalledWith(supplierId);
    expect(result).toEqual(mockSupplierResponse);
  });

  test('updateSupplier - success case', async () => {
    // Mock successful response
    (api.updateSupplier as jest.Mock).mockResolvedValueOnce(mockSupplierResponse);

    const supplierId = '123e4567-e89b-12d3-a456-426614174003';
    const updateData = { business_name: 'Updated Supplier Name' };
    
    const result = await supplierService.updateSupplier(supplierId, updateData);

    expect(api.updateSupplier).toHaveBeenCalledWith(supplierId, updateData);
    expect(result).toEqual(mockSupplierResponse);
  });

  test('deleteSupplier - success case', async () => {
    // Mock successful response
    (api.deleteSupplier as jest.Mock).mockResolvedValueOnce({ 
      data: mockSupplierResponse.data,
      message: 'Supplier deleted successfully'
    });

    const supplierId = '123e4567-e89b-12d3-a456-426614174003';
    
    const result = await supplierService.deleteSupplier(supplierId);

    expect(api.deleteSupplier).toHaveBeenCalledWith(supplierId);
    expect(result.message).toEqual('Supplier deleted successfully');
  });

  test('getSupplierById - not found case', async () => {
    // Mock not found response
    const errorResponse = {
      category: 'not_found',
      message: 'Supplier not found',
      details: {}
    };
    
    (api.getSupplierById as jest.Mock).mockResolvedValueOnce(errorResponse);

    const supplierId = 'non-existent-id';
    const result = await supplierService.getSupplierById(supplierId);

    expect(api.getSupplierById).toHaveBeenCalledWith(supplierId);
    expect(result).toEqual(errorResponse);
  });

  test('getComplianceDocuments - success case', async () => {
    // Mock successful response
    const mockDocuments = [
      { 
        id: 'doc1', 
        document_name: 'Insurance Certificate', 
        document_type: 'insurance',
        expiry_date: '2025-12-31' 
      }
    ];
    
    (api.getComplianceDocuments as jest.Mock).mockResolvedValueOnce({ 
      data: mockDocuments,
      message: 'Compliance documents fetched successfully'
    });

    const supplierId = '123e4567-e89b-12d3-a456-426614174003';
    const result = await supplierService.getComplianceDocuments(supplierId);

    expect(api.getComplianceDocuments).toHaveBeenCalledWith(supplierId);
    expect(result).toEqual({ 
      data: mockDocuments,
      message: 'Compliance documents fetched successfully'
    });
  });
});
