import { useState, useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Section {
  id: string
  title: string
}

const SECTIONS: Section[] = [
  { id: 'prerequisites', title: 'Prerequisites' },
  { id: 'connecting', title: 'Connecting Your Device' },
  { id: 'developer-mode', title: 'Enabling Developer Mode' },
  { id: 'setup-script', title: 'Running the Setup Script' },
  { id: 'verifying', title: 'Verifying the Setup' },
  { id: 'troubleshooting', title: 'Troubleshooting' },
]

function CodeBlock({ children }: { children: string }) {
  return (
    <pre
      className="bg-[#1A0E02] text-[#FFB703] rounded-xl p-4 overflow-x-auto text-sm my-4"
      style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
    >
      <code>{children}</code>
    </pre>
  )
}

function InlineCode({ children }: { children: string }) {
  return (
    <code
      className="bg-[#F5EDD8] text-[#2C1503] px-1.5 py-0.5 rounded-md text-sm"
      style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}
    >
      {children}
    </code>
  )
}

function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <h2 id={id} className="text-2xl font-extrabold text-[#2C1503] mb-6 pt-2 scroll-mt-24">
      {title}
    </h2>
  )
}

export function SetupGuidePage() {
  const [activeSection, setActiveSection] = useState<string>('prerequisites')
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const headings = SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean)

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    )

    headings.forEach((el) => {
      if (el) observerRef.current?.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Internal use banner */}
      <div className="flex items-start gap-3 bg-[#FFF3CD] border-2 border-[#FFB703] rounded-xl p-4 mb-10">
        <AlertTriangle
          size={20}
          className="text-[#2C1503] flex-shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <p className="text-sm text-[#2C1503] font-medium">
          <strong>Internal use only.</strong> This guide is intended for Dog and Bone staff and
          authorised technicians configuring customer devices. Do not share externally.
        </p>
      </div>

      <div className="flex gap-12">
        {/* Sticky sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <nav className="sticky top-24" aria-label="Setup guide sections">
            <p className="text-xs font-bold uppercase tracking-widest text-[#5A4A3A] mb-4">
              On this page
            </p>
            <ul className="flex flex-col gap-1">
              {SECTIONS.map(({ id, title }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className={cn(
                      'block text-sm py-1.5 px-3 rounded-lg transition-colors duration-150',
                      activeSection === id
                        ? 'bg-[#FFB703] text-[#2C1503] font-bold'
                        : 'text-[#5A4A3A] hover:text-[#2C1503] hover:bg-[#F5EDD8]',
                    )}
                  >
                    {title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <article className="flex-1 min-w-0 prose-custom">
          <h1 className="text-4xl font-extrabold text-[#2C1503] mb-3">Android Setup Guide</h1>
          <p className="text-[#5A4A3A] text-lg mb-12">
            Step-by-step instructions for configuring a Samsung Galaxy A12 as a Dog and Bone phone
            using our setup script.
          </p>

          {/* Prerequisites */}
          <section aria-labelledby="prerequisites">
            <SectionHeading id="prerequisites" title="1. Prerequisites" />
            <p className="text-[#5A4A3A] mb-4 leading-relaxed">
              Before you begin, make sure you have the following:
            </p>
            <ul className="flex flex-col gap-3 mb-6 text-[#2C1503]">
              {[
                'A computer running Windows 10+, macOS 11+, or Ubuntu 20.04+',
                'Android Debug Bridge (ADB) installed and available on your PATH',
                'A USB-A to USB-C data cable (not a charge-only cable)',
                'A Samsung Galaxy A12 (model SM-A125F or SM-A127F) with the screen unlocked',
                'The order ID from the Dog and Bone admin panel',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-[#FFB703] border border-[#2C1503] flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h3 className="text-lg font-bold text-[#2C1503] mb-2">Installing ADB</h3>
            <p className="text-[#5A4A3A] mb-3 leading-relaxed">
              If ADB is not yet installed, use one of the following commands:
            </p>
            <CodeBlock>{`# macOS (Homebrew)
brew install android-platform-tools

# Ubuntu / Debian
sudo apt install android-tools-adb

# Windows (Chocolatey)
choco install adb`}</CodeBlock>
            <p className="text-[#5A4A3A] leading-relaxed">
              Verify the installation by running <InlineCode>adb version</InlineCode>. You should
              see a version string such as{' '}
              <InlineCode>Android Debug Bridge version 1.0.41</InlineCode>.
            </p>
          </section>

          <hr className="border-[#F5EDD8] my-10" />

          {/* Connecting */}
          <section aria-labelledby="connecting">
            <SectionHeading id="connecting" title="2. Connecting Your Device" />
            <p className="text-[#5A4A3A] mb-4 leading-relaxed">
              Connect the Samsung Galaxy A12 to your computer via USB before enabling Developer
              Mode. The device must be unlocked.
            </p>
            <ol className="flex flex-col gap-4 mb-6 text-[#2C1503]">
              {[
                'Plug the USB-C end into the Galaxy A12 and the USB-A end into your computer.',
                'Unlock the phone and dismiss any lock screen.',
                'When prompted on the device with "Allow USB debugging?", tap Allow. Check "Always allow from this computer" if you plan to configure multiple orders.',
                'On your computer, run:',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#2C1503] text-[#FFB703] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            <CodeBlock>{`adb devices`}</CodeBlock>
            <p className="text-[#5A4A3A] mb-4 leading-relaxed">You should see output similar to:</p>
            <CodeBlock>{`List of devices attached
R58M123ABCD    device`}</CodeBlock>
            <p className="text-[#5A4A3A] leading-relaxed">
              If the device shows as <InlineCode>unauthorized</InlineCode>, accept the USB debugging
              prompt on the phone and run <InlineCode>adb devices</InlineCode> again.
            </p>
          </section>

          <hr className="border-[#F5EDD8] my-10" />

          {/* Developer Mode */}
          <section aria-labelledby="developer-mode">
            <SectionHeading id="developer-mode" title="3. Enabling Developer Mode" />
            <p className="text-[#5A4A3A] mb-4 leading-relaxed">
              USB Debugging requires Developer Mode to be active on the device.
            </p>
            <ol className="flex flex-col gap-4 mb-6 text-[#2C1503]">
              {[
                <>
                  Open <strong>Settings</strong> on the Galaxy A12.
                </>,
                <>
                  Scroll down and tap <strong>About phone</strong>.
                </>,
                <>
                  Tap <strong>Software information</strong>.
                </>,
                <>
                  Find <strong>Build number</strong> and tap it <strong>7 times</strong> in quick
                  succession. You will see a countdown toast: "You are now X steps away from being a
                  developer."
                </>,
                <>
                  Return to the main Settings screen. A new <strong>Developer options</strong> entry
                  will appear near the bottom of the list.
                </>,
                <>
                  Enter <strong>Developer options</strong> and scroll down to find{' '}
                  <strong>USB debugging</strong>. Toggle it on and confirm the dialog.
                </>,
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#2C1503] text-[#FFB703] flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-[#5A4A3A]">{step}</span>
                </li>
              ))}
            </ol>
            <div className="bg-[#FFF3CD] border border-[#FFB703] rounded-xl p-4">
              <p className="text-sm text-[#2C1503]">
                <strong>Note:</strong> On some A12 firmware versions the path is{' '}
                <InlineCode>Settings → About phone → Build number</InlineCode> without the
                intermediate "Software information" screen.
              </p>
            </div>
          </section>

          <hr className="border-[#F5EDD8] my-10" />

          {/* Setup Script */}
          <section aria-labelledby="setup-script">
            <SectionHeading id="setup-script" title="4. Running the Setup Script" />
            <p className="text-[#5A4A3A] mb-4 leading-relaxed">
              Each order has a unique setup script generated by the admin panel. The script installs
              the correct launcher profile, disables unwanted system apps, and configures device
              settings.
            </p>
            <ol className="flex flex-col gap-4 mb-6">
              {[
                <>
                  Log in to the <strong>Dog and Bone Admin Panel</strong> and open the relevant
                  order.
                </>,
                <>
                  Click <strong>Download Setup Script</strong>. The file will be saved as{' '}
                  <InlineCode>order-XXXX-setup.sh</InlineCode> (where XXXX is the order ID).
                </>,
                <>Open a terminal and navigate to your downloads folder:</>,
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#2C1503] text-[#FFB703] flex items-center justify-center font-bold text-sm flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 text-[#5A4A3A]">{step}</span>
                </li>
              ))}
            </ol>
            <CodeBlock>{`cd ~/Downloads`}</CodeBlock>
            <p className="text-[#5A4A3A] mb-2 leading-relaxed">
              Make the script executable and run it:
            </p>
            <CodeBlock>{`chmod +x order-XXXX-setup.sh
bash order-XXXX-setup.sh`}</CodeBlock>
            <p className="text-[#5A4A3A] mb-4 leading-relaxed">
              The script will print progress as it runs. A successful run ends with:
            </p>
            <CodeBlock>{`✓ Launcher installed
✓ System apps disabled
✓ Settings applied
✓ Setup complete for order XXXX`}</CodeBlock>
            <div className="bg-[#FFF3CD] border border-[#FFB703] rounded-xl p-4">
              <p className="text-sm text-[#2C1503]">
                <strong>Windows users:</strong> Run the script inside WSL (Windows Subsystem for
                Linux) or Git Bash. PowerShell is not supported.
              </p>
            </div>
          </section>

          <hr className="border-[#F5EDD8] my-10" />

          {/* Verifying */}
          <section aria-labelledby="verifying">
            <SectionHeading id="verifying" title="5. Verifying the Setup" />
            <p className="text-[#5A4A3A] mb-4 leading-relaxed">
              After the script completes, run the following checks to confirm the device is
              correctly configured.
            </p>

            <h3 className="text-lg font-bold text-[#2C1503] mb-2">Check disabled packages</h3>
            <p className="text-[#5A4A3A] mb-2 leading-relaxed">
              The following command lists all packages that have been disabled on the device:
            </p>
            <CodeBlock>{`adb shell pm list packages -d`}</CodeBlock>
            <p className="text-[#5A4A3A] mb-6 leading-relaxed">
              Verify that browser, social media, and Samsung Galaxy Store packages are in the
              disabled list based on the profile configured for the order.
            </p>

            <h3 className="text-lg font-bold text-[#2C1503] mb-2">Check launcher is installed</h3>
            <CodeBlock>{`adb shell pm list packages | grep com.dogandbonephone.launcher`}</CodeBlock>
            <p className="text-[#5A4A3A] mb-6 leading-relaxed">
              You should see <InlineCode>package:com.dogandbonephone.launcher</InlineCode> in the
              output.
            </p>

            <h3 className="text-lg font-bold text-[#2C1503] mb-2">Visual check</h3>
            <p className="text-[#5A4A3A] leading-relaxed">
              Disconnect the USB cable and reboot the device. After restart, the Dog and Bone
              launcher should appear as the home screen with the correct profile icons visible.
            </p>
          </section>

          <hr className="border-[#F5EDD8] my-10" />

          {/* Troubleshooting */}
          <section aria-labelledby="troubleshooting">
            <SectionHeading id="troubleshooting" title="6. Troubleshooting" />
            <p className="text-[#5A4A3A] mb-6 leading-relaxed">
              Below are the most common issues encountered during setup and how to resolve them.
            </p>

            <dl className="flex flex-col gap-8">
              {[
                {
                  problem: 'Device not found — adb devices shows empty list',
                  fix: (
                    <>
                      <p className="text-[#5A4A3A] mb-2">Try the following in order:</p>
                      <ul className="flex flex-col gap-2 text-[#5A4A3A] text-sm">
                        <li>• Ensure the phone is unlocked and USB debugging is enabled.</li>
                        <li>• Try a different USB cable — many cables are charge-only.</li>
                        <li>• Try a different USB port on your computer.</li>
                        <li>• On Windows, install Samsung USB drivers from the Samsung website.</li>
                        <li>
                          • Run <InlineCode>adb kill-server && adb start-server</InlineCode> then
                          retry.
                        </li>
                      </ul>
                    </>
                  ),
                },
                {
                  problem: 'Permission denied when running the setup script',
                  fix: (
                    <>
                      <p className="text-[#5A4A3A] mb-2">
                        Make sure the script is executable before running it:
                      </p>
                      <CodeBlock>{`chmod +x order-XXXX-setup.sh`}</CodeBlock>
                      <p className="text-[#5A4A3A]">
                        If the issue persists, check that you are running the script as a user with
                        ADB access and that ADB is in your PATH.
                      </p>
                    </>
                  ),
                },
                {
                  problem: "Script fails with 'adb: command not found'",
                  fix: (
                    <p className="text-[#5A4A3A]">
                      ADB is not installed or not on your PATH. Install it using the instructions in
                      the Prerequisites section and ensure the directory containing{' '}
                      <InlineCode>adb</InlineCode> is added to your shell's{' '}
                      <InlineCode>PATH</InlineCode> environment variable.
                    </p>
                  ),
                },
                {
                  problem: 'Launcher not showing after reboot',
                  fix: (
                    <>
                      <p className="text-[#5A4A3A] mb-2">
                        The launcher may not have been set as the default home app. Run:
                      </p>
                      <CodeBlock>{`adb shell cmd package set-home-activity com.dogandbonephone.launcher/.MainActivity`}</CodeBlock>
                      <p className="text-[#5A4A3A]">Then reboot the device again.</p>
                    </>
                  ),
                },
                {
                  problem: 'Setup script ends with an error mid-way',
                  fix: (
                    <p className="text-[#5A4A3A]">
                      Take note of the last line printed before the failure. Re-run the script — it
                      is designed to be idempotent and will skip steps that were already completed.
                      If the error persists, contact the engineering team with the full terminal
                      output.
                    </p>
                  ),
                },
              ].map(({ problem, fix }) => (
                <div key={problem} className="border-l-4 border-[#FFB703] pl-5">
                  <dt className="font-bold text-[#2C1503] mb-3">{problem}</dt>
                  <dd>{fix}</dd>
                </div>
              ))}
            </dl>
          </section>
        </article>
      </div>
    </div>
  )
}
