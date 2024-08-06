import { Link } from 'react-router-dom';
interface BreadcrumbProps {
  pageName: string;
  pageNameprev: string;
  pagePrevPath: string;
}
const BreadcrumbNav = ({ pageName , pageNameprev, pagePrevPath}: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-title-xl font-semibold text-[#422AFB] dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" to={`/${pagePrevPath}`}>
              {pageNameprev} /
            </Link>
          </li>
          <li className="font-medium text-primary">{pageName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default BreadcrumbNav;
