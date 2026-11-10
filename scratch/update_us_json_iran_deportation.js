const fs = require('fs');
const path = require('path');

const imageUrl = 'https://res.cloudinary.com/dcj2ovntc/image/upload/v1794217298/magazinegazette/deportation-flight-iranians-us-scuttled-last-minute.jpg';
const slug = 'deportation-flight-iranians-us-scuttled-last-minute-attorney';
const title = "Deportation Flight of Iranians From US Scuttled at Last Minute, Attorney Says";

const shortdescription = "A planned deportation flight carrying Iranian nationals was cancelled at the last minute after attorneys filed emergency motions, sparking fresh legal and humanitarian concerns over the Trump administration's immigration enforcement tactics and the absence of a U.S.-Iran deportation treaty.";

const description = `A planned deportation flight that would have removed a group of Iranian nationals from the United States was abruptly cancelled at the final hour after attorneys intervened, according to legal representatives who say their clients were given no warning and were already aboard or en route to the aircraft. The dramatic last-minute halt has drawn fresh attention to the Trump administration's aggressive immigration enforcement posture and reignited legal battles over whether Iranians facing removal are receiving adequate due process protections given the absence of diplomatic relations between Washington and Tehran.

According to attorneys involved in the case, their clients — some of whom had lived in the United States for years — were picked up by Immigration and Customs Enforcement (ICE) agents in coordinated raids and transported to staging facilities in preparation for deportation. Legal representatives say they were given little to no advance notice of the removal plans and scrambled to file emergency motions in federal court to prevent what they described as unlawful deportations. The intervention succeeded in halting the flight, but attorneys warn the reprieves may be temporary as federal immigration authorities continue to pursue removal orders aggressively.

The episode comes amid heightened diplomatic tensions between the United States and Iran, with the two countries lacking formal diplomatic ties and no active repatriation agreement in place. Critics and legal experts argue that deporting individuals to a country with which the U.S. has no bilateral deportation treaty and where returnees may face serious human rights risks raises profound legal and ethical questions. Human rights organizations have documented cases of Iranian nationals who faced imprisonment, persecution, or other serious harm upon return to Iran, particularly those who left during or after the 1979 Islamic Revolution or who are perceived as politically dissident.

Immigration attorneys said they believe the administration has been attempting to use third-country deportation routes — sending individuals to intermediary nations before onward transfer to Iran — in order to circumvent legal challenges. This approach, lawyers argue, lacks transparency and further limits the ability of detainees and their representatives to mount timely legal challenges. Several advocacy groups have filed federal lawsuits seeking broader injunctions to protect Iranian nationals from expedited removal while legal proceedings are pending.

The White House and Department of Homeland Security have not publicly confirmed the specifics of the cancelled flight but have consistently maintained that the administration is committed to enforcing immigration laws and removing individuals without legal status to their home countries. DHS officials have argued that deportation flights are a lawful and necessary enforcement tool and that legal processes are followed in all removal operations. The administration has also framed its hardline immigration enforcement as essential to national security, often citing Iran's designation as a state sponsor of terrorism as justification for prioritizing the removal of Iranian nationals.

Federal judges in multiple jurisdictions have issued temporary restraining orders and emergency stays blocking deportations in several related cases, responding to arguments from attorneys who contend that their clients face credible risks of persecution. Courts have scrutinized whether individuals are being given sufficient opportunity to apply for asylum, withholding of removal, or protection under the Convention Against Torture before being placed on deportation flights. Legal advocates emphasize that constitutional due process guarantees apply to all individuals in U.S. custody regardless of immigration status or nationality.

Community organizations serving Iranian American communities across the country have expressed alarm at the escalating pace of enforcement actions. Representatives from these groups say their members are living in fear and uncertainty, with some individuals who have green cards or pending legal applications also caught up in enforcement sweeps. They argue that broad enforcement operations are creating a climate of terror that extends beyond those with final removal orders and threatens the safety of an entire diaspora community that has contributed significantly to American society.

The situation also raises broader geopolitical questions. With no functioning U.S. embassy in Iran and Iranian assets frozen under decades of sanctions, the mechanics of large-scale deportations to Iran are inherently complicated. Iran has historically been reluctant to accept deportees from the United States, and negotiations over third-country transit arrangements have faced significant obstacles. Some analysts suggest that high-profile deportation efforts may be partly symbolic — intended to signal toughness on immigration enforcement — but warn that the humanitarian and legal consequences for the individuals involved are very real.

Immigration policy experts point out that the administration's approach reflects a broader pattern of testing the legal boundaries of executive power over immigration enforcement. Emergency court interventions have become a recurring feature of the immigration landscape in recent years, with advocacy groups and the administration locked in continuous litigation over the scope and speed of deportation operations. Legal scholars note that courts have played an increasingly important gatekeeping role, often providing the only practical check on the pace of removals.

As the legal battles continue, the families and attorneys of Iranian nationals caught in the enforcement system say the uncertainty is devastating. Many of the individuals facing deportation have deep roots in the United States — children in American schools, businesses, and community ties built over decades. Their supporters argue that the human cost of these enforcement actions extends far beyond the individuals directly affected, sending a chilling message to immigrant communities nationwide. The abrupt halt of the deportation flight may have provided temporary relief, but attorneys warn that without a durable legal resolution, their clients remain at risk of removal at any time.`;

const usJsonPath = path.join(__dirname, '../public/data/us.json');
const usData = JSON.parse(fs.readFileSync(usJsonPath, 'utf8'));

const alreadyInJson = usData.some(a => a.slug === slug);
if (alreadyInJson) {
  console.log('⚠️  Article already in us.json, skipping.');
} else {
  const jsonEntry = {
    category: 'us',
    title,
    slug,
    image: `/images/deportation-flight-iranians-us-scuttled-last-minute.jpg`,
    date: 'Nov. 09, 2026',
    shortdescription,
    description,
    author: {
      name: 'Sarah Johnson',
      role: 'Senior Political Correspondent',
      bio: 'Senior political correspondent with over a decade of experience covering Washington and international relations.',
      image: '/images/sarah-johnson.webp',
      slug: 'sarah-johnson',
      email: '',
      twitter: '',
      facebook: '',
      instagram: '',
      substack: '',
      medium: ''
    }
  };
  usData.unshift(jsonEntry);
  fs.writeFileSync(usJsonPath, JSON.stringify(usData, null, 2));
  console.log('✅ Article prepended to us.json!');
  console.log('Title :', title);
  console.log('Slug  :', slug);
  console.log('Image :', imageUrl);
}

