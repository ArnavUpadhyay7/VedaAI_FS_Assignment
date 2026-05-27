import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AssignmentEmpty() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <Image
        src="/no_assignments.png"
        alt="No assignments"
        width={240}
        height={220}
        className="mb-8 object-contain"
        priority
      />
      <h2 className="mb-2 text-xl text-[#111827]">No assignments yet</h2>
      <p className="mb-8 max-w-md text-sm leading-relaxed text-[#6B7280]">
        Create your first assignment to start collecting and grading student
        submissions. You can set up rubrics, define marking criteria, and let AI
        assist with grading.
      </p>
      <Button
        asChild
        className="h-11 gap-2 rounded-full bg-[#1C1C1C] px-6 text-sm text-white hover:bg-[#111111]"
      >
        <Link href="/assignments/create">
          <Image
            src="/create_button_icon.png"
            alt=""
            width={16}
            height={16}
            className="size-4 object-contain"
          />
          Create Your First Assignment
        </Link>
      </Button>
    </div>
  );
}
