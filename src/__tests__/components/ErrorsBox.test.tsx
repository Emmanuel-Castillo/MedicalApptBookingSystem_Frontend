import { render, screen } from "@testing-library/react"
import ErrorsBox from "../../components/ErrorsBox"

describe("ErrorsBox", () => {
    it("renders list of errors, given a list of size > 0", () => {
        const errors = [
            "Error1",
            "Error2",
            "Error3"
        ]

        render(<ErrorsBox errors={errors}/>)
        expect(screen.getByTestId("errorsbox")).toBeInTheDocument();
        expect(screen.getByText("Error1")).toBeInTheDocument()
        expect(screen.getByText("Error2")).toBeInTheDocument()
        expect(screen.getByText("Error3")).toBeInTheDocument()
    })

    it("doesn't render a list, given a list of size == 0", () => {
        const errors: string[] = []
        render(<ErrorsBox errors={errors}/>)

        expect(screen.queryByTestId("errorsbox")).toBeNull();   // Query checks for component w/ test-id: "errorsbox" to be null (not present)
    })
})