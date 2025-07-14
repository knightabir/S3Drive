"use server"

const Footer = () => (
  <footer className="bg-secondary text-primary py-8 border-t border-border">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="text-lg font-semibold">S3Drive &copy; {new Date().getFullYear()}</div>
      <div className="flex gap-6">
        <a href="/about" className="hover:text-primary-foreground transition-colors">About</a>
        <a href="/contact" className="hover:text-primary-foreground transition-colors">Contact</a>
        <a href="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</a>
      </div>
    </div>
  </footer>
);

export default Footer;
