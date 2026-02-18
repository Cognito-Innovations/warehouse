import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";
import * as auth from "./src/hooks/useAuth";

jest.mock("./src/hooks/useAuth");

Object.assign(global, { TextEncoder, TextDecoder });

beforeEach(() => {
  jest.clearAllMocks();

  (auth.useAuth as jest.Mock).mockReturnValue({
    user: { id: 1, name: "Admin" },
    isAuthenticated: true,
    logout: jest.fn(),
  });
});