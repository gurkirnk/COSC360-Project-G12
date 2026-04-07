import { useState } from "react";
import { adminDeleteListing } from "../lib/api/features/list";
import { useEffect } from "react";
import { useAuth } from "../contexts/useAuth";
import { useSearchParams } from "react-router-dom";

export default function AdminListDeletePage() {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { user, isAuthenticated, isAdmin } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams(window.location.search);
    const listingId = searchParams.get("id") || "";

    async function removeListing() {
        try {
            const response = await adminDeleteListing(listingId);
            setSuccessMessage("Deletion successful.");
        } catch (error) {
            setErrorMessage("Failed to delete listing:", error);
        }
    }

    if (!isAuthenticated) {
        return <NotAllowedPage details="You must be logged in to view this page." />;
    }
    if (!isAdmin) {
        return <NotAllowedPage details="You must be an admin to access this page." />;
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
