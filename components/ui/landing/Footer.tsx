import { Mail, Linkedin, MapPin } from "lucide-react";
import { siInstagram } from "simple-icons/icons";

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <img
              src="/image/logo/aws_student_builder_group.png"
              alt="AWS Student Builder Group"
              className="h-12"
            />

            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-300">
              AWS Student Builder Group at LPU helps students learn cloud
              computing through workshops, certifications, projects, and an
              active technical community.
            </p>

            <div className="mt-6 flex gap-4">
              <a
                href="http://linkedin.com/company/awsbuilderslpu"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
              >
                <Linkedin size={20} />
              </a>

              <a
                href="https://instagram.com/awsbuilders.lpu"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
              >
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="currentColor"
                >
                  <path d={siInstagram.path} />
                </svg>
              </a>

              <a
                href="mailto:club@awslpu.in"
                className="rounded-lg border border-slate-700 p-2 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-400"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="mt-5 space-y-3 text-slate-300">
              <li>
                <a href="/#about" className="hover:text-cyan-400">
                  About
                </a>
              </li>
              <li>
                <a href="/events" className="hover:text-cyan-400">
                  Events
                </a>
              </li>
              <li>
                <a href="/auth/register" className="hover:text-cyan-400">
                  Join Community
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">
              Contact
            </h3>

            <div className="mt-5 space-y-4 text-slate-300">
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-cyan-400" />
                <a
                  href="mailto:club@awslpu.in"
                  className="hover:text-cyan-400"
                >
                  club@awslpu.in
                </a>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-cyan-400" />
                <span>Lovely Professional University, Punjab</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-700 pt-8 text-sm text-slate-400 md:flex-row">
          <p>
            © 2026 AWS Student Builder Group LPU. All rights reserved.
          </p>

          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-cyan-400">
              Privacy
            </a>

            <a href="/terms" className="hover:text-cyan-400">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}