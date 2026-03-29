import { useState } from "react";
import { deleteListing } from "../lib/api/features/list";
import { useEffect } from "react";
import { useAuth } from "../contexts/useAuth";
import { useSearchParams } from "react-router-dom";

export default function ListDeletePage() {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { user, isAuthenticated } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams(window.location.search);
    const listingId = searchParams.get("id") || "";

    async function removeListing() {
        try {
            const response = await deleteListing(listingId);
            setSuccessMessage("Deletion successful.");
        } catch (error) {
            setErrorMessage("Failed to delete listing:", error);
        }
    }

    if (!isAuthenticated) {
        return <h1>Please Sign in to delete listings</h1>
    }

    return (
        <>
            <h2>Delete Listing? This action cannot be undone.</h2>
            <button type="button" onClick={removeListing}>Confirm</button>
            {errorMessage ? <p>{errorMessage}</p> : null}
            {successMessage ? <p>{successMessage}</p> : null}
        </>
    );
}
