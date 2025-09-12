import { fireEvent, render, screen } from "@testing-library/react"
import Navbar from "../../components/Navbar"
import { UserRole } from "../../types/dtos"

const logOutcallback = jest.fn()
function renderNavbar(role: UserRole = "Admin") {
    return <Navbar
        fullName="Test name"
        role={role}
        logOut={logOutcallback}
    />
}

describe("Navbar", () => {
    it("renders name and role given to the Navbar", () => {
        render(renderNavbar())
        expect(screen.getByTestId("navbar-fullName")).toHaveTextContent("Test name (Admin)")
    })

    it("renders patient navlinks when used by a patient", () => {
        render(renderNavbar("Patient"))
        expect(screen.getByTestId("patient-navLinks")).toBeInTheDocument()
    })

    it("doesn't render patient navlinks when used by anyone other than a patient", () => {
        render(renderNavbar("Doctor"))
        expect(screen.queryByTestId("patient-navLinks")).toBeNull()
    })

    it("invokes the logOutcallback when clicking the logOut button", () => {
        render(renderNavbar())
        const button = screen.getByTestId("logout-btn")
        fireEvent.click(button)
        expect(logOutcallback).toHaveBeenCalled()
    })
})