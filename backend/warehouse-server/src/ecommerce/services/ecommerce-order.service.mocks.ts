import { jest } from '@jest/globals';

interface MockRepository {
  find: jest.MockedFunction<() => any>;
  findOne: jest.MockedFunction<() => any>;
  save: jest.MockedFunction<() => any>;
  create: jest.MockedFunction<() => any>;
  createQueryBuilder: jest.MockedFunction<() => any>;
  update: jest.MockedFunction<() => any>;
}

export const mockRepository = (): MockRepository => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  createQueryBuilder: jest.fn(),
  update: jest.fn(),
});

interface MockQueryRunner {
  connect: jest.MockedFunction<() => any>;
  startTransaction: jest.MockedFunction<() => any>;
  commitTransaction: jest.MockedFunction<() => any>;
  rollbackTransaction: jest.MockedFunction<() => any>;
  release: jest.MockedFunction<() => any>;
  manager: {
    save: jest.MockedFunction<() => any>;
    findOne: jest.MockedFunction<() => any>;
    update: jest.MockedFunction<() => any>;
    lock: { mode: 'pessimistic_write' };
  };
}

export const mockQueryRunnerFactory = (): MockQueryRunner => ({
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    save: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    lock: { mode: 'pessimistic_write' },
  },
});

interface MockUserPreferencesService {
  getUserPreferredCurrency: jest.MockedFunction<() => Promise<null>>;
}

export const mockUserPreferencesService: MockUserPreferencesService = {
  getUserPreferredCurrency: jest.fn<() => Promise<null>>().mockResolvedValue(null),
};

interface MockPaymentService {
  createPayPalPaymentSession: jest.MockedFunction<() => any>;
  capturePayPalPayment: jest.MockedFunction<() => any>;
  applyPayPalToOrder: jest.MockedFunction<() => any>;
}

export const mockPaymentService: MockPaymentService = {
  createPayPalPaymentSession: jest.fn(),
  capturePayPalPayment: jest.fn(),
  applyPayPalToOrder: jest.fn(),
};

interface MockCartService {
  getSelectedDeliveryOption: jest.MockedFunction<() => Promise<null>>;
  clearSelectedDeliveryOption: jest.MockedFunction<() => any>;
}

export const mockCartService: MockCartService = {
  getSelectedDeliveryOption: jest.fn<() => Promise<null>>().mockResolvedValue(null),
  clearSelectedDeliveryOption: jest.fn(),
};

interface MockDataSource {
  createQueryRunner: jest.MockedFunction<() => any>;
}

export const mockDataSource: MockDataSource = {
  createQueryRunner: jest.fn().mockImplementation(mockQueryRunnerFactory),
};
