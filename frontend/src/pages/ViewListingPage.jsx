import { useState } from "react";
import { browseListingsById } from "../lib/api/features/list";
import { useAuth } from "../contexts/useAuth";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Listings from "../components/Listings";

export default function ViewListingPage() {
    const { user, isAuthenticated } = useAuth();
    const [listing, setListing] = useState({ title: "", genre: "", format: "", description: "" });
    const [searchParams, setSearchParams] = useSearchParams(window.location.search);
    const listingId = searchParams.get("id") || "";
    const [deleteStatus, setDeleteStatus] = useState("");

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
    async function handleDelete(event) {
        
    }

    return (
        <>
            <h1>Title: {listing.title}</h1>
            <h3>Genre: {listing.genre}</h3>
            <h3>Format: {listing.format}</h3>
            <p>{listing.description}</p>
        </>
    );
}
