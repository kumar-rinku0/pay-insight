import PunchInEmployees from "./punchin-employees";

const Dashboard = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-2 justify-around items-center">
      <div className="flex gap-2">
        <PunchInEmployees />
      </div>
    </div>
  );
};

export default Dashboard;
