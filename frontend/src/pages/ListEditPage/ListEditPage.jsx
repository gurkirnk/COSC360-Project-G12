import { useState, useEffect } from "react";
import { editListing, browseListingsById } from "../../lib/api/features/list";
import { useAuth } from "../../contexts/useAuth";
import { useSearchParams } from "react-router-dom";
import "./ListEditPage.css";

export default function ListEditPage() {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, isAuthenticated } = useAuth();
    const [listing, setListing] = useState({ title: "", genre: "", format: "", description: "" });
    const [searchParams] = useSearchParams(window.location.search);
    const listingId = searchParams.get("id") || "";

    useEffect(() => {
        async function fetchListings() {
            try {
                const response = await browseListingsById(listingId);
                setListing(response.results || response);
            } catch (error) {
                console.error("Failed to load listing:", error);
            }
        }

        fetchListings();
    }, [listingId]);

    if (!listing.userId) {
        return <h1>Loading...</h1>;
    }
    if (!isAuthenticated) {
        return <h1>Please sign in to edit listings</h1>;
    }
    if (listing.userId != user.id) {
        return <h1>This listing was created by another user. Please choose a listing belonging to you to edit</h1>;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setListing(prev => ({ ...prev, [name]: value }));
    };

    async function handleRegisterSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const title = formData.get("title")?.toString().trim() ?? "";
        const genre = formData.get("genre")?.toString().trim() ?? "";
        const format = formData.get("format")?.toString() ?? "";
        const description = formData.get("description")?.toString() ?? "";

        setErrorMessage("");
        setSuccessMessage("");
        setIsSubmitting(true);

        try {
            await editListing({ title, genre, format, description, listingId });
            setSuccessMessage("Edit successful.");
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="edit-listing-page">
            <h1>Edit Listing</h1>
            <form onSubmit={handleRegisterSubmit}>
                <label htmlFor="title">
                    Title:
                    <input id="title" type="text" name="title" value={listing.title} onChange={handleChange} required />
                </label>
                <label htmlFor="genre">
                    Genre:
                    <input id="genre" type="text" name="genre" value={listing.genre} onChange={handleChange} required />
                </label>
                <label htmlFor="format">
                    Format:
                    <select id="format" name="format" onChange={handleChange} required>
                        <option>Paperback</option>
                        <option>Hardcover</option>
                        <option>Mass Market Paperback</option>
                    </select>
                </label>
                <label htmlFor="description">
                    Description:
                    <input id="description" type="text" name="description" value={listing.description} onChange={handleChange} />
                </label>
                <input type="submit" value={isSubmitting ? "Submitting..." : "Submit"} disabled={isSubmitting} />
            </form>
            {errorMessage ? <p className="message-error">{errorMessage}</p> : null}
            {successMessage ? <p className="message-success">{successMessage}</p> : null}
        </div>
    );
}