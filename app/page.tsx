import BG from "@/components/BG/BG";
import Table from "@/components/Table/Table";
export default function Home() {
  return (
    <div className="overflow-clip max-h-screen">
      <div className="absolute z-0 overflow-hidden">
      <BG />
      </div>
      <Table />
    </div>
  );
}
