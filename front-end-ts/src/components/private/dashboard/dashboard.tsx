import PunchInEmployees from "./punchin-employees";

const Dashboard = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-2 justify-around items-center">
      <div>
        <PunchInEmployees />
      </div>
      <div>not-punchin users</div>
    </div>
  );
};

export default Dashboard;
