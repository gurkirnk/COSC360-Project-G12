import { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getUserById } from "../lib/api/features/user/user"

export default function AdminUserDeletePage() {
    const { user, isAuthenticated, isAdmin } = useAuth();
    const [userInfo, setUserInfo] = useState({ id: "", name: "", profilePictureLink: ""});
    const [searchParams, setSearchParams] = useSearchParams(window.location.search);
    const userId = searchParams.get("id") || "";

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await getUserById(userId);
                setUserInfo(response.results || response);
            } catch (error) {
                console.error("Failed to load User:", error);
            }
        }

        fetchUser();
    }, [userId]);

    if (!userInfo.id) {
        return <h1>Loading...</h1>
    }
    if (!isAuthenticated) {
        return <NotAllowedPage details="You must be logged in to view this page." />;
    }
    if (!isAdmin) {
        return <NotAllowedPage details="You must be an admin to access this page." />;
    }

    return (
        <section className="profile-page">
            <div className="profile-card">
                <h1>User Found</h1>

                {userInfo.profilePictureLink ? (
                    <div className="profile-profile-picture">
                        <img src={userInfo.profilePictureLink} alt={`${userInfo.name ?? "User"}'s profile picture`} />
                    </div>
                ) : null}

                <dl className="profile-details">
                    {Object.entries(userInfo).map(([key, value]) => (
                        <div className="profile-detail-row" key={key}>
                            <dt>{key}</dt>
                            <dd>{JSON.stringify(value)}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}
