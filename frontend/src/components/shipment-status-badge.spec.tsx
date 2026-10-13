import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ShipmentStatusBadge from "./shipment-status-badge";

describe("ShipmentStatusBadge", () => {
  it.each([
    ["DELIVERED", "bg-green-100"],
    ["IN_TRANSIT", "bg-blue-100"],
    ["PICKED_UP", "bg-cyan-100"],
    ["ASSIGNED", "bg-yellow-100"],
    ["CANCELLED", "bg-red-100"],
    ["CREATED", "bg-gray-100"]
  ])("renders %s with correct color class", (status, expectedClass) => {
    render(<ShipmentStatusBadge status={status} />);

    const badge = screen.getByText(status);
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain(expectedClass);
  });
});
