import { useState } from "react";
import { browseListingsById } from "../lib/api/features/list";
import { useAuth } from "../contexts/useAuth";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Listings from "../components/Listings";

export default function ViewListingPage() {
    const { user, isAuthenticated } = useAuth();
    const [listing, setListing] = useState({_id:"", title: "", genre: "", format: "", description: "", userId: "" });
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
            <Listings listings={{results:[listing]}}/>
        </>
    );
}
