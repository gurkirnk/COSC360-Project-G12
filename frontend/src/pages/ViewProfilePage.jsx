import { useState } from "react";
import { useAuth } from "../contexts/useAuth";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getUserById, deleteUser, getUserByName, getUserByEmail } from "../lib/api/features/user/user"
import ErrorPage from "./ErrorPage";

export default function ViewProfilePage() {
    const { user, isAuthenticated, isAdmin } = useAuth();
    const [userInfo, setUserInfo] = useState({ id: "", name: "", profilePictureLink: "" });
    const [searchParams, setSearchParams] = useSearchParams(window.location.search);
    const [deleteStatus, setDeleteStatus] = useState("");
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || ";"

    useEffect(() => {
        async function fetchUser() {
            try {
                let response;
                if (type == "id"){
                    response = await getUserById(search);
                }else if(type == "name"){
                    response = await getUserByName(search);
                }
                else{
                    response = await getUserByEmail(search);
                }
                setUserInfo(response.results || response);
            } catch (error) {
                console.error("Failed to load User:", error);
            }
        }

        fetchUser();
    }, [search, type]);

    async function handleDelete() {
        try {
            const response = await deleteUser(userInfo.id);
            setDeleteStatus("Deletion successful.");
        } catch (error) {
            setDeleteStatus("Failed to delete listing:", error);
        }
    }

    if (userInfo == { id: "", name: "", profilePictureLink: "" }) { //if userInfo is still the default, then we are still fetching
        return <h1>Loading...</h1>
    }
    if (!isAuthenticated) {
        return <NotAllowedPage details="You must be logged in to view this page." />;
    }
    if(!userInfo.id){//if there is no userInfo.id, then fetching is complete (no longer default), but we failed to find a user
        return <ErrorPage details="Could not find user."/>
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

                
                {isAdmin?
                <>
                    <label for="delete">Delete User? This Cannot Be undone</label>
                    <button onClick={handleDelete}>Delete</button>
                    <p>{deleteStatus}</p>
                </>
                :<></>}
            </div>
        </section>
    );
}
