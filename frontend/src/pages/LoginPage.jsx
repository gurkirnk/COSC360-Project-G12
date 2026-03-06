export default function LoginPage() {
    return (
        <>
            <h1>Login Page</h1>
            <form>
                <label for="username">
                    username: 
                    <input id="username" type="text" name="name" />
                </label>
                <label for="password">
                    password: 
                    <input id="password" type="password" name="password" />
                </label>
                <input type="submit" value="Submit" />
            </form>
        </>
    );
}