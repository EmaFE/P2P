import React from "react"
import CommunityCard from "../../components/CommunityCard"

const Communities = () =>{

  return(
    <section id="Communities" className="mt-20 md:mt-30 lg:mt-10 scroll-mt-30 mb-20">
      <h2 className="w-screen bg-[var(--color-six)] text-slate-100 font-semibold px-5 py-10 rounded-sm text-3xl text-center bg-opacity-80 mb-15">Communities</h2>
      <div className='grid grid-cols-1 gap-5 px-5 py-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 lg:mx-5 place-items-center bg-[var(--color-seven)]/70 lg:px-25 lg:py-20 lg:mt-3 rounded-2xl'>

        <CommunityCard name="Anxiety" description="A supportive, judgment-free space to share posts about anxiety, read others’ experiences, and connect through understanding. Whether you’re venting, asking for advice, or quietly scrolling, this peer-to-peer community is here to remind you that anxiety is shared and manageable together, at your own pace." route="/community/anxiety"/>

        <CommunityCard name="Grief" description="An online peer space for expressing grief through words, stories, and reflection. Post when you’re ready, respond when you have the energy, or simply read and feel less alone. There’s no right way to grieve here; just mutual respect, empathy, and support from people who understand loss." route="/community/grief"/>

        <CommunityCard name="Students" description="An online community for university students to post about stress, academics, relationships, and everything in between. Share your experiences, ask questions, or browse anonymously for reassurance and perspective. This space exists to remind students that struggling doesn’t mean failing, and no one has to figure it out alone." route="/community/universityStudents"/>

      </div>
    </section>
  )
}

export default Communities