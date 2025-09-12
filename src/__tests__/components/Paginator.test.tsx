import { SetStateAction, useState } from "react";
import Paginator from "../../components/Paginator";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

function PaginatorWrapper({
  initialPage,
  totalCount,
}: {
  initialPage: number;
  totalCount: number;
}) {
  const [page, setPage] = useState(initialPage);
  return (
    <>
      <Paginator
        page={page}
        setPage={setPage}
        pageSize={10}
        totalCount={totalCount}
      />
      <span data-testid={"span-page"}>{page}</span>
    </>
  );
}

describe("Paginator", () => {
  it("sets value of page up by 1 when clicking Next", async () => {
    render(<PaginatorWrapper initialPage={1} totalCount={Number.MAX_VALUE} />);
    const nextBtn = screen.getByTestId("next-btn");
    expect(screen.getByTestId("span-page")).toHaveTextContent("1");

    await userEvent.click(nextBtn);

    await waitFor(() =>
      expect(screen.getByTestId("span-page")).toHaveTextContent("2")
    );
  });

  it("attempts to increase page by 1, but doesnt' work when Next btn is disabled", async () => {
    // Setting the totalCount as the Number.MIN_VALUE should make the Next btn disabled
    render(<PaginatorWrapper initialPage={1} totalCount={Number.MIN_VALUE} />);
    const nextBtn = screen.getByTestId("next-btn");
    expect(screen.getByTestId("span-page")).toHaveTextContent("1");

    await userEvent.click(nextBtn);

    await waitFor(() =>
      expect(screen.getByTestId("span-page")).toHaveTextContent("1")
    );
  });

  it("sets value of page down by 1, starting with value of 5, when click Previous", async () => {
    render(<PaginatorWrapper initialPage={5} totalCount={Number.MAX_VALUE} />);
    const prevBtn = screen.getByTestId("previous-btn");
    expect(screen.getByTestId("span-page")).toHaveTextContent("5");

    await userEvent.click(prevBtn);

    await waitFor(() =>
      expect(screen.getByTestId("span-page")).toHaveTextContent("4")
    );
  });

  it("attempts to decrease page by 1, but doesn't work when Previous btn is disabled", async () => {
    render(<PaginatorWrapper initialPage={1} totalCount={Number.MAX_VALUE} />);
    const prevBtn = screen.getByTestId("previous-btn");
    expect(screen.getByTestId("span-page")).toHaveTextContent("1");

    await userEvent.click(prevBtn);

    await waitFor(() =>
      expect(screen.getByTestId("span-page")).toHaveTextContent("1")
    );
  });
});
