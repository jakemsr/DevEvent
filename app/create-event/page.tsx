"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";


export default function Page() {

  const [status, setStatus] = useState("");
  const [numAgenda, setNumAgenda] = useState(4);

  const { data: session } = authClient.useSession();
  if (!session || (session?.user.role !== "creator" && session?.user.role !== "admin")) {
    return (
    <section id="create-event">
      <h1 className="mb-8">Not Authorized</h1>
      Please contact admin if you would like to be able to add events.
    </section>
    )
  }

  const handleAddAgenda = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setNumAgenda(prev => prev + 1);
  }

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("Sending ...");

    const formData = new FormData(event.currentTarget);
    
    const tags = formData.getAll("tag").filter(value => value !== "");
    formData.set("tags", JSON.stringify(tags));

    const agenda = formData.getAll("agenda").filter(value => value !== "");
    formData.set("agenda", JSON.stringify(agenda));

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setStatus("Success!");
      } else {
        setStatus(`Error: ${data.message}: ${data.error}`);
      }
    } catch (error) {
      setStatus(`Submission failed ${error}`);
    }
  }

  return (
    <section id="create-event">
      <h1 className="mb-8">Create Event</h1>

      {isPending ? (
        <p>Loading session...</p>
      ) : (

        (!session || (session?.user.role !== "creator" && session?.user.role !== "admin")) ? (
          <>
            <h1 className="mb-8">Not Authorized</h1>
            Please contact admin if you would like to be able to add events.
          </>
        ) : (

      <form onSubmit={handleSubmit}>

        <div className="w-80 grid grid-cols-1 xl:grid-cols-2 gap-2 xl:gap-4">

          <div>
            <label htmlFor="title">Title</label>
          </div>
          <div className="max-xl:mb-4">
            <input type="text" id="title" name="title" size={25} />
          </div>

          <div>
            <label htmlFor="description">Description</label>
          </div>
          <div className="max-xl:mb-4">
            <textarea id="description" name="description" rows={4} cols={35} maxLength={1000} />
          </div>

          <div>
            <label htmlFor="overview">Overview</label>
          </div>
          <div className="max-xl:mb-4">
            <textarea id="overview" name="overview" rows={2} cols={35} maxLength={500} />
          </div>

          <div>
            <label htmlFor="location">Location</label>
          </div>
          <div className="max-xl:mb-4">
            <input type="text" id="location" name="location" size={25} />
          </div>

          <div>
            <label htmlFor="venue">Venue</label>
          </div>
          <div className="max-xl:mb-4">
            <input type="text" id="venue" name="venue" size={25} />
          </div>

          <div>
            <label htmlFor="date">Date</label>
          </div>
          <div className="max-xl:mb-4">
            <input type="date" id="date" name="date" />
          </div>

          <div>
            <label htmlFor="time">Time</label>
          </div>
          <div className="max-xl:mb-4">
            <input type="time" id="time" name="time" />
          </div>

          <div>
            <label htmlFor="mode">Mode</label>
          </div>
          <div className="max-xl:mb-4">
            <select id="mode" name="mode" defaultValue="hybrid" >
              <option value="hybrid">Hybrid</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div>
            <label htmlFor="audience">Audience</label>
          </div>
          <div className="max-xl:mb-4">
            <input type="text" id="audience" name="audience" size={25} />
          </div>

          <div>
            <label htmlFor="organizer">Organizer</label>
          </div>
          <div className="max-xl:mb-4">
            <input type="text" id="organizer" name="organizer" size={25} />
          </div>

          <div>
            <label htmlFor="image">Image</label>
          </div>
          <div className="max-xl:mb-4">
            <input type="file" id="image" name="image" accept="image/*" />
          </div>

          <div>
            <label htmlFor="tag0">Tags</label>
          </div>
          <div className="grid grid-cols-4 gap-2 w-100 max-xl:mb-4">
            <input type="text" id="tag0" name="tag" size={15} />
            <input type="text" id="tag1" name="tag" size={15} />
            <input type="text" id="tag2" name="tag" size={15} />
            <input type="text" id="tag3" name="tag" size={15} />
            <input type="text" id="tag4" name="tag" size={15} />
            <input type="text" id="tag5" name="tag" size={15} />
            <input type="text" id="tag6" name="tag" size={15} />
            <input type="text" id="tag7" name="tag" size={15} />
          </div>

          <div>
            <label htmlFor="agenda0">Agenda</label>
          </div>
          <div className="flex flex-col gap-2 w-100 max-xl:mb-4">
            {Array.from({ length: numAgenda }).map((_, index) => (
              <input key={index} type="text" id={`agenda${index}`} name="agenda" size={35} />
            ))}
            <button type="button" onClick={handleAddAgenda} >Add row</button>
          </div>

        </div>

        <div className="my-4 w-80">
          <button type="submit">Submit</button>
        </div>

        <p>{status}</p>

      </form>
    </section>
  );
}
