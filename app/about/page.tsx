import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0B1D3A] to-[#132E59] text-white">
      <div className="mx-auto max-w-5xl px-6 py-28">
        <header className="max-w-3xl">
          <h1 className="text-5xl font-bold">About Us</h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            AWS Student Builder Group at Lovely Professional University is a
            student-led technical community that helps students learn cloud
            computing through workshops, hands-on projects, certifications,
            hackathons, and networking opportunities.
          </p>
        </header>

        <section className="mt-20">
          <h2 className="text-3xl font-semibold">
            What are AWS Student Builder Groups?
          </h2>

          <p className="mt-6 leading-8 text-slate-300">
            AWS Student Builder Groups are student communities that encourage
            learning, collaboration, and innovation around Amazon Web Services.
            They provide a space where students can explore cloud technologies,
            build real-world skills, participate in technical events, and
            connect with fellow learners and industry professionals.
          </p>

          <p className="mt-4 leading-8 text-slate-300">
            Through workshops, study sessions, hands-on labs, hackathons, and
            certification preparation, Student Builder Groups help students
            prepare for careers in cloud computing and modern software
            development.
          </p>
        </section>

        <section className="mt-20">
          <h2 className="text-3xl font-semibold">
            AWS Student Builder Group LPU
          </h2>

          <p className="mt-6 leading-8 text-slate-300">
            Founded at Lovely Professional University, AWS Student Builder Group
            LPU aims to make cloud learning accessible to every student,
            regardless of their previous experience. We organize technical
            workshops, speaker sessions, community meetups, certification
            guidance, and practical learning experiences throughout the year.
          </p>

          <p className="mt-4 leading-8 text-slate-300">
            Our mission is to create an inclusive community where students can
            learn by building, collaborate on innovative projects, and grow
            together as future cloud engineers, developers, architects, and
            technology leaders.
          </p>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
            <h3 className="text-xl font-semibold">Learn</h3>

            <p className="mt-3 text-slate-300">
              Hands-on workshops, cloud fundamentals, certification guidance,
              and technical sessions.
            </p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
            <h3 className="text-xl font-semibold">Build</h3>

            <p className="mt-3 text-slate-300">
              Develop real-world cloud projects, participate in hackathons, and
              gain practical experience.
            </p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-900/40 p-6">
            <h3 className="text-xl font-semibold">Connect</h3>

            <p className="mt-3 text-slate-300">
              Meet fellow students, industry professionals, AWS experts, and
              alumni through community events.
            </p>
          </div>
        </section>

        <section className="mt-20 rounded-2xl border border-slate-700 bg-slate-900/40 p-10 text-center">
          <h2 className="text-3xl font-semibold">
            Join Our Community
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Whether you're just beginning your cloud journey or already building
            with AWS, our community provides opportunities to learn, collaborate,
            and grow alongside like-minded students.
          </p>

          <Link
            href="/auth/register"
            className="mt-8 inline-flex rounded-lg bg-cyan-500 px-6 py-3 font-medium text-slate-900 transition hover:bg-cyan-400"
          >
            Join AWS Student Builder Group
          </Link>
        </section>
      </div>
    </main>
  );
}