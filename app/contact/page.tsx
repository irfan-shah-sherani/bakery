import PageHeader from "@/components/PageHeader";

export default function Contact() {
  return (
    <>
      <PageHeader title="Contact" />
      <div className="container-fluid pt-5">
        <div className="container">
          <div className="row px-3 pb-2">
            <ContactInfo icon="fa-map-marker-alt" title="Address" text="123 Street, New York, USA" />
            <ContactInfo icon="fa-phone-alt" title="Phone" text="+012 345 6789" />
            <ContactInfo icon="fa-envelope" title="Email" text="info@example.com" />
          </div>
          <div className="row">
            <div className="col-md-6 pb-5">
              <iframe 
                style={{ width: "100%", height: "443px", border: 0 }}
                src="https://www.google.com/maps/embed?..." 
                allowFullScreen 
              />
            </div>
            <div className="col-md-6 pb-5">
              <form>
                <input type="text" className="form-control bg-transparent p-4 mb-3" placeholder="Your Name" />
                <input type="email" className="form-control bg-transparent p-4 mb-3" placeholder="Your Email" />
                <textarea className="form-control bg-transparent py-3 px-4 mb-3" rows={5} placeholder="Message" />
                <button className="btn btn-primary font-weight-bold py-3 px-5">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ContactInfo({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="col-sm-4 text-center mb-3">
      <i className={`fa fa-2x ${icon} mb-3 text-primary`}></i>
      <h4 className="font-weight-bold">{title}</h4>
      <p>{text}</p>
    </div>
  );
}