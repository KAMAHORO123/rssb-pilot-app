import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ErrorBoundary from "./error-boundary";

function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>Normal content</div>;
}

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("ErrorBoundary", () => {
  it("renders children when no error", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Normal content")).toBeInTheDocument();
  });

  it("renders error UI when child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test error")).toBeInTheDocument();
    expect(screen.getByText("Try again")).toBeInTheDocument();
    expect(screen.getByText("Go home")).toBeInTheDocument();
  });

  it("recovers when Try again is clicked", async () => {
    const user = userEvent.setup();
    let shouldThrow = true;

    function Wrapper() {
      if (shouldThrow) {
        throw new Error("Test error");
      }
      return <div>Recovered</div>;
    }

    const { rerender } = render(
      <ErrorBoundary>
        <Wrapper />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByText("Try again"));

    rerender(
      <ErrorBoundary>
        <Wrapper />
      </ErrorBoundary>
    );

    expect(screen.getByText("Recovered")).toBeInTheDocument();
  });
});
