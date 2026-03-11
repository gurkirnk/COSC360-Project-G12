import AddOne from "../components/AddOne";

export default function HomePage() {
  return (
    <>
      <h1>Hi!</h1>
      <p>
        The layout component can be used to wrap any page in the app and will
        automatically include the header and footer.
      </p>
      <p>
        Breadcrumbs now follow router paths and update automatically as you
        navigate between pages.
      </p>
      <AddOne />
    </>
  );
}
