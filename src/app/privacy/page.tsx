import Link from "next/link";
import globalStyles from "../../styles/global-styles.module.css";
import styles from "./privacy-page-styles.module.css";
import type { NestedListProps } from "~/types/JsxComponents";

function NestedList({ bulletList }: NestedListProps) {
  return (
    <>
      {bulletList.map((item, index) => (
        <div key={index}>
          <div className={styles.mainNumberedItemContainer}>
            <p>{`${index + 1}.`}</p>
            <p dangerouslySetInnerHTML={{ __html: item.mainItem }} />
          </div>

          <ul className={styles.nestedList}>
            {item.nested?.map((text, nestedIndex) => (
              <li
                key={nestedIndex}
                className={styles.nestedListItem}>
                {text}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

export default function PrivacyStatementPage() {
  const nestedList = [
    {
      mainItem: `If you are only browsing this website, IMDA does not capture data that allows us to identify you individually. IMDA may use various technologies, including but not limited to, cookies to improve and customise your experience on this website, and understand how you are using the website. The technologies IMDA use do not capture any personally identifiable data about you, but captures your browsing pattern on this website and some other websites after you browse here. This analysis and information will be used by us to improve and customise your experience on this website, and may be shared with our selected group of partners to improve and customise your experience on their websites, or enable them to provide you with information on relevant programmes and services.`,
    },
    {
      mainItem: `You can choose to accept or decline cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. This may prevent you from taking full advantage of the website.`,
    },
    {
      mainItem: `If you provide us with personally identifiable data:`,
      nested: [
        `We may share necessary data with other Government agencies, so as to serve you in the most efficient and effective way unless such sharing is prohibited by law.`,
        `IMDA will NOT share your Personal Data with non-Government entities, except where such entities have been authorised to carry out specific Government services.`,
        `For your convenience, we may also display the data you had supplied to us or other Government Agencies. This will speed up the transaction and save you the trouble of repeating previous submissions. Should the data be out-of-date, please supply us the latest data.`,
      ],
    },
    {
      mainItem: `To safeguard your Personal Data, all electronic storage and transmission of Personal Data is secured with appropriate security technologies.`,
    },
    {
      mainItem: `This site may contain links to non-Government sites whose data protection and privacy practices may differ from ours. IMDA is not responsible for the content and privacy practices of these other websites and encourage you to consult the privacy notices of those sites.`,
    },
    {
      mainItem: `Please contact <a
      class='text-blue-700 underline'
      href="mailto:Data_Innovation@imda.gov.sg">
      Data_Innovation@imda.gov.sg.
    </a> if you:`,
      nested: [
        `have any enquires or feedback on our data protection policies and procedures, and/or`,
        `need more information on or access to data which you have provided to us in the past.`,
      ],
    },
  ];

  return (
    <>
      <h1 className={globalStyles.pageTitle}>Privacy Statement</h1>
      <section>
        <NestedList bulletList={nestedList} />
        <p className="mt-10">LAST UPDATED: 17 JAN 2024</p>
      </section>
    </>
  );
}
