import { useEffect, useState } from "react";
import AuthPage from "../components/AuthPage";
import { useAuth } from "../contexts/useAuth";
import { createImageUploadPayload } from "../lib/images";
import NotAllowedPage from "./NotAllowedPage";

export default function EditProfilePage() {
    const { user, isAuthenticated, editUser } = useAuth();
    const [formdata, setFormData] = useState({ name: user.name || "", profilePictureLink: user.profilePictureLink || "", email: user.email || "", password: "" })
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
            setFormData({ name: user.name || "", profilePictureLink: user.profilePictureLink || "", email: user.email || "", password: "" });
        }, [user]);

    async function handleRegisterSubmit(event) {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        const profilePictureFile = data.get("profilePicture");

       

        setErrorMessage("");
        setSuccessMessage("");
        setIsSubmitting(true);

        try {
             let profilePicture = formdata.profilePictureLink;
            if (profilePictureFile && profilePictureFile.size > 0) {
                profilePicture = await createImageUploadPayload(profilePictureFile);
            }

            const result = await editUser({
                id: user.id,
                name: formdata.name,
                email: formdata.email,
                password: formdata.password,
                profilePicture: profilePicture
            });
            setSuccessMessage(`Edit successful. You're good to go, ${result.user?.name ?? name}.`);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formdata, [e.target.name]: e.target.value });
    };

    if(!isAuthenticated){
        return <NotAllowedPage details="Please sign in to edit your profile" />
    }

    return (
        <AuthPage title="Change your account details">
            <form className="auth-form" onSubmit={handleRegisterSubmit}>
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <input
                        className="input"
                        id="name"
                        type="text"
                        name="name"
                        value={formdata.name}
                        onChange={handleChange}
                        autoComplete="name"
                        required
                    />
                </div>

                <div className="field">
                    <label htmlFor="email">Email</label>
                    <input
                        className="input"
                        id="email"
                        type="email"
                        name="email"
                        value={formdata.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />
                </div>

                <div className="field">
                    <label htmlFor="password">Password</label>
                    <input
                        className="input"
                        id="password"
                        type="password"
                        name="password"
                        minLength="6"
                        placeholder="Minimum 6 characters"
                        value={formdata.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />
                </div>

                <div className="field">
                    <label htmlFor="profilePicture">Profile Picture</label>
                    <input
                        className="input input--file"
                        id="profilePicture"
                        type="file"
                        name="profilePicture"
                        accept="image/*"
                    />
                </div>

                <input
                    className="submit"
                    type="submit"
                    value={isSubmitting ? "Submitting..." : "Edit Account"}
                    disabled={isSubmitting}
                />
            </form>

            {errorMessage ? <p className="message message--error">{errorMessage}</p> : null}
            {successMessage ? <p className="message message--success">{successMessage}</p> : null}
        </AuthPage>
    );
}
