"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";

gsap.registerPlugin(useGSAP);

function Home() {
  const [task, settask] = useState("");
  const [desc, setdesc] = useState("");
  const [Storetask, setStoretask] = useState([]);
  const [expandedId, setexpandedId] = useState("");
  const [editingId, setEditingId] = useState("");
  const [edittask, setEdittask] = useState("");
  const [editdesc, setEditdesc] = useState("");
  const [deadline, setdeadline] = useState("");
  const [editdeadline, setEditdeadline] = useState("");
  const listcontainer = useRef();
  const colors = [
    "default",
    "primary",
    "secondary",
    "success",
    "warning",
    "danger",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      setStoretask((prevTasks) => {
        let changed = false;

        const updated = prevTasks
          .map((t) => {
            const timeLeft = t.deadline - now;

            if (timeLeft <= 30 * 60 * 1000 && timeLeft > 0 && !t.warned30Min) {
              toast.warning(`Task "${t.task}" is due in 30 minutes!`);
              changed = true;
              return { ...t, warned30Min: true };
            }

            if (timeLeft <= 0) {
              toast.error(`Task "${t.task}" has expired.`);
              changed = true;
              return null;
            }

            return t;
          })
          .filter(Boolean);

        return changed ? updated : prevTasks;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const submitHandler = (e) => {
    e.preventDefault();

    if (task.trim() && desc.trim() && deadline) {
      if (!task.trim()) {
        toast.error("Task Name is Required");
        return;
      }
      if (!desc.trim()) {
        toast.error("Task Description is Required");
      }
      if (!deadline) {
        toast.error("Task Deadline is required");
      }
      const deadlineTime = new Date(deadline).getTime();

      if (deadlineTime <= Date.now()) {
        toast.error("Deadline Must be in the Future");
        return;
      }

      const newTask = {
        id: Date.now(),
        task,
        desc,
        deadline: deadlineTime,
        warned30Min: false,
      };

      setStoretask((prev) => [...prev, newTask]);
      settask("");
      setdesc("");
      toast.success("Task Added");
    } else {
      toast.error("Please Enter a Task Name and Description.");
    }
  };

  const editHandler = (taskObj) => {
    setEditingId(taskObj.id);
    setEdittask(taskObj.task);
    setEditdesc(taskObj.desc);
    const datetime = new Date(taskObj.deadline);
    const local = new Date(
      datetime.getTime() - datetime.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .slice(0, 16);
    setEditdeadline(local);
  };
  const saveEditHandler = () => {
    const newDeadline = new Date(editdeadline).getTime();
    if (newDeadline <= Date.now()) {
      toast.error("Deadline must be in the future");
      return;
    }
    const updatedTasks = Storetask.map((t) =>
      t.id === editingId
        ? {
            ...t,
            task: edittask,
            desc: editdesc,
            deadline: newDeadline,
            warned30Min: false,
          }
        : t,
    );
    setStoretask(updatedTasks);
    setEditingId(null);
    toast.success("Task Updated");
  };
  const deleteHandler = (i) => {
    setStoretask((prev) => prev.filter((_, index) => index !== i));
    toast.success("Task Deleted");
  };

  useGSAP(() => {
    if (!listcontainer.current) return;

    const items = listcontainer.current.children;
    const lastitem = items[items.length - 1];

    if (lastitem) {
      gsap.from(lastitem, {
        y: 30,
        opacity: 0,
        stagger: 0.1,
      });
    }
  }, [Storetask]);

  useGSAP(() => {
    gsap.from("#task", {
      height: 0,
      width: 0,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });
  });

  let rendertask = <h2 className="text-xl">no task available</h2>;

  if (Storetask.length > 0) {
    rendertask = Storetask.map((t, i) => {
      return (
        <div
          key={t.id}
          className="grid grid-cols-7 gap-4 items-center px-4 my-2"
        >
          <div className="col-span-1 min-w-0 text-2xl font-semibold break-words text-center">
            {t.task}
          </div>

          <div
            className={`col-span-2 min-w-0 text-lg break-words text-center ${
              expandedId === t.id ? "" : "line-clamp-2"
            }`}
          >
            {t.desc}
          </div>

          <div className="col-span-1 flex justify-center">
            {t.desc.length > 90 && (
              <button
                type="button"
                onClick={() => setexpandedId(expandedId === t.id ? null : t.id)}
                className="text-blue-400 cursor-pointer text-sm"
              >
                {expandedId === t.id ? "See Less" : "See More"}
              </button>
            )}
          </div>

          <div className="col-span-1 min-w-0 text-sm text-yellow-300 break-words text-center">
            {new Date(t.deadline).toLocaleString()}
          </div>

        
          <div
            onClick={() => editHandler(t)}
            className="col-span-1 cursor-pointer hover:text-blue-700 flex justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
              />
            </svg>
          </div>

          <div
            onClick={() => deleteHandler(i)}
            className="col-span-1 cursor-pointer text-white hover:text-red-700 flex justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </div>
        </div>
      );
    });
  }

  return (
    <div className="-z-10 grid items-center justify-around h-screen w-screen text-white capitalize">
      <Image
        src="/background.jpg"
        alt="Background"
        fill
        priority
        style={{ objectFit: "cover" }}
      />
      <div className="w-screen flex items-center justify-center">
        <div className="font-myfont backdrop-blur-2xl bg-black/40 border border-white/80 rounded-xl w-[55vw] p-6 text-5xl text-center z-10">
          A WEBSITE TO MANAGE
          <div className="text-center">YOUR DAILY TASKS</div>
        </div>
      </div>

      <form className="z-10" onSubmit={submitHandler}>
        <div className="z-10 w-full flex items-center justify-center gap-5 mb-20">
          <Input
            isRequired
            type="text"
            label="Enter Task"
            labelPlacement="inside"
            variant="bordered"
            color="success"
            radius="md"
            className="max-w-[15vw] h-20"
            classNames={{
              label: "text-white/70 font-medium",
              inputWrapper:
                "border-black/70 hover:border-blue-500 focus-within:!border-white/80 transition-colors",
              input: "text-white ",
            }}
            value={task}
            onChange={(e) => {
              settask(e.target.value);
            }}
          />
          <Textarea
            isRequired
            type="text"
            label="Enter Description"
            labelPlacement="inside"
            variant="bordered"
            color="default"
            radius="md"
            className="max-w-[15vw] h-20"
            classNames={{
              label: "text-white/70 font-medium overflow-y-auto",
              inputWrapper:
                "border-black/70 hover:border-blue-500 focus-within:!border-white/80 transition-colors",
              input: "text-white ",
            }}
            value={desc}
            onChange={(e) => {
              setdesc(e.target.value);
            }}
          />
          <input
            type="datetime-local"
            value={deadline}
            required
            min={new Date().toISOString().slice(0, 16)}
            onChange={(e) => {
              setdeadline(e.target.value);
            }}
            className="h-20 w-[15vw] p-4 border-black/70  border-2 rounded-md"
          />
          <div className="text-white backdrop-blur-2xl border border-white/80 bg-black/40 h-12 w-30 rounded-md text-xl flex items-center justify-center hover:scale-105 duration-150 active:scale-95 ">
            <button className="">Add Task</button>
          </div>
        </div>
      </form>
      <div className="flex items-center justify-center">
        <div
          id="task"
          className="custom-scrollbar z-10 w-[75vw] backdrop-blur-2xl bg-black/40 border border-white/80 mx-20 my-10 p-4 rounded-xl text-white duration-75 min-h-36 overflow-y-auto"
        >
          <ol ref={listcontainer}>{rendertask}</ol>
        </div>
      </div>
      {editingId && (
        <div className="font-myfont fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black/60 z-100">
          <div className=" backdrop-blur-2xl bg-black/50 text-white p-6 rounded-xl w-100 space-y-4 shadow-2xl">
            <h2 className="text-2xl font-bold text-center">Edit Task</h2>

            <input
              type="text"
              value={edittask}
              onChange={(e) => setEdittask(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <textarea
              value={editdesc}
              onChange={(e) => setEditdesc(e.target.value)}
              className="w-full border p-2 custom-scrollbar rounded"
            />

            <label className="text-sm text-white/70">Deadline</label>
            <input
              type="datetime-local"
              value={editdeadline}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => setEditdeadline(e.target.value)}
              className="w-full border p-2 rounded text-white"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setEditingId(null)}
                className="bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveEditHandler}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
