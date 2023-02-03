import { BeakerIcon } from "@heroicons/react/24/solid";

export default function TestPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <BeakerIcon className="h-6 w-6 text-blue-500" />
      <button className="w-full border">Button</button>
    </div>
  );
}
