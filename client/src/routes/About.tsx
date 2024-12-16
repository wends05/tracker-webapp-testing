const About = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 px-10 md:px-20">
      <div className="flex max-w-screen-md flex-col items-center justify-center gap-5">
        <h1>About this project</h1>
        <p>
          This project aims to provide a well organized and easy to use
          budgeting web application by segregating expenses into categories with
          weekly split budgets.
        </p>

        <p>
          The project aims to help users visualize expenses in groups of weeks
          and categories, allowing then to analyze their spending habits and
          make informed decisions on how to manage their finances.
        </p>
      </div>
      <div className="flex max-w-screen-md flex-col items-center justify-center gap-5">
        <h2 className="font-bold">Developers</h2>
        <ul>
          <li>Gedalanga, Alhena Julienne</li>
          <li>Dador, Wendell Terence F.</li>
          <li>Gallo, Cassandra Ysabel</li>
          <li>Barte, Regine Therese</li>
          <li>Asesor, Vhea</li>
          <li>Samenian, Joshua</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
