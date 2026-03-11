import { useState } from "react";

import { addOneApi } from "../../lib/api/features/addOne";

export default function AddOne() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");

    async function handleAddOne() {
        setIsSubmitting(true);
        setMessage("");

        try {
            const data = await addOneApi();

            setMessage(
                `Saved +1. Total value: ${data.total}. Total events: ${data.events}.`
            );
        } catch (error) {
            setMessage(error.message || "Could not connect to backend.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <>
            <button type="button" onClick={handleAddOne} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Add +1 To Database"}
            </button>
            {message ? <p>{message}</p> : null}
        </>
    );
}