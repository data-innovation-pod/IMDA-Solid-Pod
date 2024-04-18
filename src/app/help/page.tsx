import globalStyles from "../../styles/global-styles.module.css";
import styles from "./help-page-styles.module.css";
import type { UnderlinedSectionProps, SectionHeaderProps, BulletedListProps, ParagraphsProps } from "~/types/JsxComponents";
import editPic from "../_assets/images/editing_profile.png";
import myDataPic from "../_assets/images/my_data.png";
import myContactsPic from "../_assets/images/my_contacts.png";
import usingAppsPic from "../_assets/images/using_applications.png";
import historyPic from "../_assets/images/history.png";
import sharedPic from "../_assets/images/shared_data.png";
import signOutPic from "../_assets/images/sign_out.png";
import supportPic from "../_assets/images/support.png";

import Image from "next/image";

function SectionHeader({ title, children }: SectionHeaderProps) {
  return (
    <div className={styles.sectionTitleContainer}>
      {children}
      <p className={styles.sectionTitle}>{title}</p>
    </div>
  );
}

function NumberedList({ numberedText, nestedText, variant }: BulletedListProps) {
  return (
    <>
      {numberedText.map((text, index) =>
        variant ? (
          <div
            className={styles.listContainer}
            key={index}>
            <p>-</p>
            <p dangerouslySetInnerHTML={{ __html: text }} />
          </div>
        ) : (
          <div
            className={styles.listContainer}
            key={index}>
            <p>{`${index + 1}.`}</p>
            <p>{text}</p>
          </div>
        )
      )}
      {nestedText?.map((text, index) => (
        <div
          key={index}
          className={styles.nestedListContainer}>
          <p>{`${String.fromCharCode(97 + index)}.`}</p>
          <p dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      ))}
    </>
  );
}

function UnderlinedSection({ title, paraText, numberedText, nestedText, variant, children }: UnderlinedSectionProps) {
  return (
    <>
      <p className={styles.paraUnderlineText}>{title}</p>
      <p className={styles.paraText}>{paraText}</p>
      {variant ? (
        <ul className="ml-8">
          {numberedText?.map((text, index) => (
            <li
              key={index}
              className={styles.listBulletedText}
              dangerouslySetInnerHTML={{ __html: text }}></li>
          ))}
        </ul>
      ) : (
        numberedText?.map((text, index) => (
          <div
            className={styles.listContainer}
            key={index}>
            <p>{`${index + 1}.`}</p>
            <p>{text}</p>
          </div>
        ))
      )}
      {nestedText?.map((text, index) => (
        <div
          key={index}
          className={styles.nestedListContainer}>
          <p>{`${String.fromCharCode(97 + index)}.`}</p>
          <p dangerouslySetInnerHTML={{ __html: text }}></p>
        </div>
      ))}
      {children}
    </>
  );
}

function Paragraphs({ paraText }: ParagraphsProps) {
  return paraText.map((text, index) => (
    <p
      key={index}
      className={styles.paraText}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  ));
}

export default function HelpPage() {
  return (
    <>
      <h1 className={globalStyles.pageTitle}>User Guide</h1>
      <p className={styles.sectionTitle}>Contents</p>
      <UnderlinedSection
        numberedText={[
          `<a class='underline text-blue-700' href="#editing_profile">Editing Profile</a>`,
          `<a class='underline text-blue-700' href="#my_data" >My Data</a>`,
          `<a class='underline text-blue-700' href="#my_contacts">My Contacts</a>`,
          `<a class='underline text-blue-700' href="#using_applications">Using Applications</a>`,
          `<a class='underline text-blue-700' href="#history">History</a>`,
          `<a class='underline text-blue-700' href="#shared_data">Shared Data</a>`,
          `<a class='underline text-blue-700' href="#sign_out">Sign Out</a>`,
          `<a class='underline text-blue-700' href="#support">Support</a>`,
        ]}
        variant="bullet"
      />
      <div
        id={"editing_profile"}
        className="h-[20px]"
      />
      <section>
        <SectionHeader title="Editing Profile">
          <Image
            src={editPic}
            alt="edit"
          />
        </SectionHeader>

        <p className={styles.paraText}>Provide your name, email address and a profile picture to personalise your PODS profile.</p>
        <NumberedList
          numberedText={["From any page, click the avatar icon at the top-right, then choose “Edit Profile”.", "At the Profile page:"]}
          nestedText={[
            "Enter your name.",
            "Enter your email address.",
            "Click the avatar icon to upload a photo.",
            "Click “Save”.",
            "Click “Close” once the user’s details have been saved.",
          ]}
        />
      </section>
      <div
        id={"my_data"}
        className="h-[20px]"
      />
      <section>
        <SectionHeader title="My Data">
          <Image
            src={myDataPic}
            alt="my data"
          />
        </SectionHeader>

        <Paragraphs
          paraText={[
            `Use this to manage your resources and folders in your PODS. Available functions include creating folders, uploading files, and sharing
          resources and folders.`,
            `Click “My Data” in the left navigation to get started.`,
          ]}
        />

        <UnderlinedSection
          title="Create Folder"
          numberedText={["Click “Create folder” above the file listing.", "Enter the name of your folder.", "Click “Create folder”."]}
        />
        <UnderlinedSection
          title="Upload File"
          numberedText={["Click “Upload file” above the file listing.", "Select the file that you want to upload from your computer to upload it."]}
        />
        <UnderlinedSection
          title="Upload Folder"
          numberedText={[
            "Click “Upload folder” above the file listing.",
            "Select the folder that you want to upload from your computer to upload it.",
          ]}>
          <p className={styles.paraText}>
            <strong>Note:</strong> All of the folder’s contents will be uploaded as well.
          </p>
        </UnderlinedSection>
        <UnderlinedSection
          title="View details of a resource or folder"
          numberedText={["Click the 3-dot menu of the resource of your choice.", "Click “View Details/Share” from the menu."]}>
          <p className={styles.paraText}>
            A side panel opens showing details of the selected resource or folder, and also the available sharing options.
          </p>
        </UnderlinedSection>
        <UnderlinedSection
          title="Copy the link of a resource or folder"
          numberedText={[
            "Click the 3-dot menu of the resource that you want to copy the link.",
            "Click “Copy Link” from the menu.",
          ]}></UnderlinedSection>
        <UnderlinedSection
          title="Download a resource"
          numberedText={["Click the 3-dot menu of the resource that you want to download.", "Click “Download” from the menu."]}>
          <p className={styles.paraText}>
            <strong>Note:</strong> You <em>cannot</em> download a folder.
          </p>
        </UnderlinedSection>
        <UnderlinedSection
          title="Delete a resource or folder"
          numberedText={["Click the 3-dot menu of the item that you want to delete.", "Click “Delete” from the menu."]}>
          <p className={styles.paraText}>
            <strong>Important:</strong> Deleting a folder will result in all of the files and folders in that folder to be deleted as well.
          </p>
        </UnderlinedSection>
        <p className={styles.subSectionTitle}>Share a resource or folder</p>
        <p className={styles.paraText}>Solid has two types of access controls for folders and resources:</p>
        <NumberedList
          numberedText={[
            `<strong>Viewer</strong>: The shared user can copy the item’s link and/or download it.`,
            `<strong>Editor</strong>: The shared user can copy the item’s link, download it, and/or delete it. If the shared item is a folder, the
            shared user can also create folders and upload files in that shared folder.`,
          ]}
          variant="dash"
        />

        <p className={styles.paraText}>To start sharing a resource or folder:</p>
        <NumberedList
          numberedText={["Click the 3-dot menu of the resource that you want to view details.", "Click “View Details/Share” from the menu."]}
        />
        <UnderlinedSection
          title="To grant “Viewer” access to another user"
          numberedText={["Click “Add/Remove” in the “Allow Read Only” section of the side panel.", "Under “Allow Access”:"]}
          nestedText={[
            `Enter the WebID of the user that you want to share the item with (Note: the full WebID of the user has to be entered). If the user is an existing contact, start typing a few letters to allow for easier selection from your My Contacts list.
        `,
            `Click “+Add WebID”.`,
            `Click “Save”.`,
          ]}>
          <p className={styles.paraText}>
            <strong>Tip:</strong> To add more than one Viewer at the same time, follow steps 2a and 2b for every user that you want to share with,
            before clicking “Save”.
          </p>
        </UnderlinedSection>
        <UnderlinedSection
          title="To delete a user who has been granted “Viewer” access"
          numberedText={["Click “Add/Remove” in the “Allow Read Only” section of the side panel.", "Under “Allow Access”:"]}
          nestedText={[`In the list of Viewers, click the checkbox next to the user to highlight the user.`, `Click “Delete”.`, `Click “Save”.`]}>
          <p className={styles.paraText}>
            <strong>Tip:</strong> You can select more than one Viewer to delete.
          </p>
        </UnderlinedSection>
        <UnderlinedSection
          title="To grant “Editor” access to another user"
          numberedText={["Click “Add/Remove” in the “Allow Read and Edit” section of the side panel.", "Under “Allow Access”:"]}
          nestedText={[
            `Enter the WebID of the user that you want to share the item with (<strong>Note</strong>: the full WebID of the user has to be entered). If the user is an existing contact, start typing a few letters to allow for easier selection from your My Contacts list.
            `,
            `Click “+Add WebID”.`,
            `Click “Save”.`,
          ]}>
          <p className={styles.paraText}>
            <strong>Tip:</strong> To add more than one Editor at the same time, follow steps 2a and 2b for every user that you want to share with,
            before clicking “Save”.
          </p>
        </UnderlinedSection>
        <UnderlinedSection
          title="To delete a user who has been granted “Editor” access"
          numberedText={["Click “Add/Remove” in the “Allow Read and Edit” section of the side panel.", "Under “Allow Access”:"]}
          nestedText={[`In the list of Editors, click the checkbox next to the user to highlight the user.`, `Click “Delete”.`, `Click “Save”.`]}>
          <p className={styles.paraText}>
            <strong>Tip:</strong> You can select more than one Editor to delete.
          </p>
        </UnderlinedSection>
      </section>
      <div
        id={"my_contacts"}
        className="h-[20px]"
      />
      <section>
        <SectionHeader title="My Contacts">
          <Image
            src={myContactsPic}
            alt="my contacts"
          />
        </SectionHeader>
        <Paragraphs
          paraText={[
            "Solid uses a decentralised identifier for users called WebID. Recall that a WebID had been created for you when you first registered with the CSS.",
            `My Contacts will help you manage your contacts’ WebIDs conveniently. After adding a user as your contact, you will be able to select that user more quickly when sharing a resource with them, rather than entering their entire WebID all over again.`,
            `To add a contact, you will first need that user’s WebID. Example: <span class='underline text-blue-700'>https://server1.sgpod.com/username/profile/card#me</span>`,
            `Then, follow these steps to add that user as your contact:`,
          ]}
        />
        <NumberedList
          numberedText={["Click “My Contacts” in the left navigation.", "At the My Contacts page:"]}
          nestedText={["Click “Add new contact”.", "Enter the WebID of your contact.", "Click “Add contact”."]}
        />
      </section>
      <div
        id={"using_applications"}
        className="h-[20px]"
      />
      <section>
        <SectionHeader title="Using Applications">
          <Image
            src={usingAppsPic}
            alt="using applications"
          />
        </SectionHeader>
        <Paragraphs
          paraText={[
            `This platform has a custom feature that lets you import your data from Spotify and YouTube into your PODS. This feature is not part of the Solid specification, and has been provided to demonstrate part of Solid’s potential – to empower you to have a central repository of your data. You can also share this data with other users subsequently.
            `,
            `To import data from an application – we use Spotify as an example:`,
          ]}
        />
        <ul>
          <li className={styles.paraNumberedText}>1. Click “Applications” in the left navigation.</li>
          <li className={styles.paraNumberedText}>2. At the Applications page:</li>
        </ul>
        <ul>
          <li className={styles.paraList}>a. Click the “Connect” button in the Spotify box.</li>
        </ul>
        <ul>
          <li className={styles.paraNumberedText}>3. You will then be given a choice to:</li>
        </ul>
        <ul>
          <li className={styles.paraList}>a. Select the categories that you want to import.</li>
          <li className={styles.paraList}>b. Select the folder (in your PODS) to save your data to.</li>
          <li className={styles.paraList}>c. Click “Import”.</li>
        </ul>
        <ul>
          <li className={styles.paraNumberedText}>4. At the Spotify data for Solid page:</li>
        </ul>
        <ul>
          <li className={styles.paraList}>a. Wait for the import to finish.</li>
          <li className={styles.paraList}>b. Click the link to open the selected folder, or click “Continue” to return to the My Data page.</li>
        </ul>
        <Paragraphs
          paraText={[
            `The data imported to your PODS will not be deleted from your Spotify or YouTube accounts, but merely copied over to your PODS.`,
          ]}
        />
      </section>
      <div
        id={"history"}
        className="h-[20px]"
      />
      <section>
        <SectionHeader title="History">
          <Image
            src={historyPic}
            alt="history"
          />
        </SectionHeader>
        <Paragraphs
          paraText={[
            `The History provides a detailed record of activities related to the data upload, import, deletion, access grant and/or modification within your Solid PODS. This is invaluable for monitoring and maintaining the integrity and security of the data within your Solid PODS. It helps in identifying unauthorised or suspicious activities, ensuring data compliance, and allowing for accountability by keeping a record of all the related user and data activities.`,
            `To view your History page, click “History” in the left navigation.`,
          ]}
        />
        <UnderlinedSection
          title="Action Type"
          paraText="This indicates the nature of the action taken within your PODS. It helps to identify specific operations that had been performed. Recorded actions are:"
          numberedText={[
            "Create Folder",
            "Delete Folder",
            "Upload Resource",
            "Download Resource",
            "Delete Resource",
            "Add Contact",
            "Delete Contact",
            "Grant Access",
            "Revoke Access",
          ]}
          variant="bullet"
        />
        <UnderlinedSection
          title="Action By and Action On"
          paraText="These record the identities of the users who had performed the action. It is essential for accountability and tracing actions back to specific individuals."
          numberedText={[
            "Action By: the user who had performed the action in the PODS.",
            "Action On: the user on the receiving end of the performed action.",
          ]}
          variant="bullet"
        />
        <UnderlinedSection
          paraText="Possible values are:"
          numberedText={["Me, i.e. you.", "WebID of a user who had been granted access to the specific resource."]}
          variant="bullet"
        />
        <UnderlinedSection
          title="Resource"
          paraText="This refers to the folder/file that had been acted on. It is the full URL of your resource."
        />
        <UnderlinedSection
          title="Before"
          paraText="This records the previous state or content of the resource before the action was performed. It is particularly useful for tracking changes and understanding what was modified."
        />
        <UnderlinedSection
          title="After"
          paraText="This records the new state or content of the resource after the action is completed. This allows you to see what was added or modified."
        />
        <UnderlinedSection
          title="Date & Time"
          paraText="This records when the action had been performed, and provides a chronological record of events. This is essential for tracking the sequence of actions ."
        />
      </section>
      <div
        id={"shared_data"}
        className="h-[20px]"
      />
      <section>
        <SectionHeader title="Shared Data">
          <Image
            src={sharedPic}
            alt="shared data"
          />
        </SectionHeader>
        <Paragraphs
          paraText={[
            `Solid allows you to share resources and folders with other Solid users. This is fundamentally done by granting the appropriate access (“Editor” or “Viewer”) to that user.`,
            `To view all the resources or folders that have been shared with you, you can use the Shared Data section. All items that have been shared with you by other users in this platform will be shown here. If a user revokes your access to an item, it will be removed from your Shared Data view.`,
          ]}
        />
        <UnderlinedSection
          paraText="To view the resources and folders that have been shared with you:"
          numberedText={[
            "Click “Shared Data” in the left navigation.",
            "Click the name or WebID of the user to expand the list.",
            "In the expanded list:",
          ]}
          nestedText={[
            `If the shared item is a folder, click on it to browse the contents within that folder (<strong>Note:</strong> as an Editor, you can upload, create or delete files/folders within the folder).`,
            `If the shared item is a resource, clicking on its 3-dot menu will download the resource or copy its link.`,
          ]}
        />
      </section>
      <div
        id={"sign_out"}
        className="h-[20px]"
      />
      <section>
        <SectionHeader title="Sign Out">
          <Image
            src={signOutPic}
            alt="sign out"
          />
        </SectionHeader>
        <UnderlinedSection numberedText={["From any page, click the avatar icon at the top-right, then choose “Sign out”."]} />
      </section>
      <div
        id={"support"}
        className="h-[20px]"
      />
      <section>
        <SectionHeader title="Support">
          <Image
            src={supportPic}
            alt="support"
          />
        </SectionHeader>
        <span className={styles.paraText}>For further support, please contact us by </span>
        <a
          className={globalStyles.linkText}
          href="mailto:Data_Innovation@imda.gov.sg">
          Data_Innovation@imda.gov.sg.
        </a>
      </section>
    </>
  );
}
