import { Component, ElementRef, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { IProduct, IProductCreateDto } from '../../../Core/models/product.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ICategory } from '../../../Core/models/category.model';
import { SortBy, SortOrder } from '../../../Core/enums/sort.enum';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { ProductService } from '../../../Core/services/product.service';
import { Router } from '@angular/router';
import { ModalService } from '../../../Core/services/modal.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { ExcelService } from '../../../Core/services/excel.service';
import { AuthService } from '../../../Core/services/auth.service';
import { CategoryService } from '../../../Core/services/category.service';
import { environment } from "../../../../environments/environment";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PreviewImages } from '../preview-images/preview-images';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-dashboard',
  imports: [FormsModule, MatFormFieldModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, CommonModule, FormsModule,
    ReactiveFormsModule, MatIconModule, MatButtonModule, MatInputModule, MatTab, MatTabGroup, MatSelectModule, MatTableModule
    , MatPaginator, MatTooltipModule, MatSlideToggleModule, MatToolbarModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  productForm: FormGroup;
  categoryForm: FormGroup;
  isEditing = false;
  isEditingCat = false;
  currentProductId: string | null = null;
  currentCatId: string | null = null;
  displayedColumns: string[] = ['image', 'name', 'description', 'category', 'createdAt', 'status', 'actions'];
  displayedColumnsCat: string[] = ['name', 'description', 'createdAt', 'isActive', 'actions'];
  lstProd: IProduct[] = [];
  dataSourceProd = new MatTableDataSource<IProduct>([]);
  dataSourceCat = new MatTableDataSource<ICategory>();
  totalItems = 0;
  totalItemsCat = 0;
  pageSize = 5;
  pageSizeCat = 5;
  pageIndex = 0;
  pageIndexCat = 0;
  sortBy: SortBy = SortBy.Name;
  sortOrder: SortOrder = SortOrder.Ascending;
  selectedSort: string = 'Name-Ascending';
  sortByCat: SortBy = SortBy.Name;
  sortOrderCat: SortOrder = SortOrder.Ascending;
  selectedSortCat: string = 'Name-Ascending';
  nameFilter = '';
  descriptionFilter = '';
  categoryFilter = '';
  categories: ICategory[] = [];
  primaryColor = '#656ac1';
  accentColor = '#8a92f2';
  redColor = '#f61d1dff';
  url = ''
  previewUrl: string | ArrayBuffer | null = null;
  file: File | null = null;

  constructor(private fb: FormBuilder, private _producServic: ProductService, private _category: CategoryService,
    private router: Router, private modalService: ModalService, private excel: ExcelService, private authService: AuthService
    , private dialog: MatDialog, private zone: NgZone, private cdr: ChangeDetectorRef,) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      shortDescription: ['', Validators.required],
      categoryId: ['', Validators.required],
      status: [true, Validators.required],
    });
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      isActive: [true, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.url = environment.Url
  }

  loadProducts(): void {
    this._producServic.getProducts(
      this.nameFilter,
      this.descriptionFilter,
      this.categoryFilter,
      this.sortBy,
      this.sortOrder,
      this.pageIndex + 1,
      this.pageSize
    ).subscribe({
      next: data => {
        if (data.result) {
          this.dataSourceProd.data = data.result.items
          this.lstProd = data.result.items
          this.totalItems = data.result.totalCount;
        } else {
          this.modalService.ShowError(data.message);
        }
      },
      error: err => {
        if (err.status == 401) {
          this.logout()
        }
        this.modalService.ShowError(err.error.message);
      }
    });
  }
  loadCategories(): void {
    this._category.getCategories(
      "",
      this.sortByCat,
      this.sortOrderCat,
      this.pageIndexCat + 1,
      this.pageSizeCat
    ).subscribe({
      next: data => {
        if (data.result) {
          this.categories = data.result.items.filter(x => x.isActive)
          this.dataSourceCat.data = data.result.items
          this.totalItemsCat = data.result.totalCount;
        } else {
          this.modalService.ShowError(data.message);
        }
      },
      error: err => {
        if (err.status == 401) {
          this.logout()
        }
        this.modalService.ShowError(err.error.message);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  onPageChangeCat(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCategories();
  }
  onSortSelectChange(event: any): void {
    const value = event.value;
    const [field, direction] = value.split('-');

    switch (field) {
      case 'name':
        this.sortBy = SortBy.Name;
        break;
      case 'category':
        this.sortBy = SortBy.Category;
        break;
      case 'createdAt':
        this.sortBy = SortBy.CreatedAt;
        break;
      default:
        this.sortBy = SortBy.Name;
    }

    switch (direction) {
      case 'asc':
        this.sortOrder = SortOrder.Ascending;
        break;
      case 'desc':
        this.sortOrder = SortOrder.Descending;
        break;
      default:
        this.sortOrder = SortOrder.Ascending;
    }
    this.loadProducts();
  }

  onSortSelectChangeCat(event: any): void {
    const value = event.value;
    const [field, direction] = value.split('-');

    switch (field) {
      case 'name':
        this.sortByCat = SortBy.Name;
        break;
      case 'category':
        this.sortByCat = SortBy.Category;
        break;
      case 'createdAt':
        this.sortByCat = SortBy.CreatedAt;
        break;
      default:
        this.sortByCat = SortBy.Name;
    }

    switch (direction) {
      case 'asc':
        this.sortOrderCat = SortOrder.Ascending;
        break;
      case 'desc':
        this.sortOrderCat = SortOrder.Descending;
        break;
      default:
        this.sortOrderCat = SortOrder.Ascending;
    }
    this.loadCategories();
  }
  applyFilters(): void {
    this.pageIndex = 0;
    this.loadProducts();
  }

  resetFilters(): void {
    this.nameFilter = '';
    this.descriptionFilter = '';
    this.categoryFilter = '';
    this.applyFilters();
  }

  editProduct(product: IProduct): void {
    this.isEditing = true;
    this.currentProductId = product.id;
    this.productForm.patchValue({
      name: product.name,
      shortDescription: product.shortDescription,
      categoryId: product.categoryId,
      status: product.status,
    });
    this.tabGroup.selectedIndex = 1;
    this.previewUrl = this.url + product.imageUrl
  }
  editCategory(category: ICategory): void {
    this.isEditingCat = true;
    this.currentCatId = category.id;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description,
      isActive: category.isActive,
    });
    this.tabGroup.selectedIndex = 3;
  }

  View(imageUrl: string): void {
    this.dialog.open(PreviewImages, {
      data: { imageUrl: this.url + imageUrl },
      panelClass: 'custom-dialog'
    });
  }

  deleteProduct(id: string): void {
    this.modalService.ShowConfirm('¿Estás seguro de eliminar este producto?', (confirmed) => {
      if (confirmed) {

        this._producServic.deleteProduct(id).subscribe({
          next: data => {
            if (data.result) {
              this.modalService.ShowSuccess(data.message);
              this.loadProducts();
              this.tabGroup.selectedIndex = 0;

            } else {

              this.modalService.ShowError(data.message);
            }
          },
          error: err => {
            if (err.status == 401) {

              this.logout()
            }

            this.modalService.ShowError(err.error.message);
          }
        });
      }
    });
  }

  submitFormProd(): void {
    if (!this.isEditing) { this.productForm.patchValue({ status: true }); }

    if (this.productForm.valid) {
      const productData: IProductCreateDto = this.productForm.value;

      if (this.file == null && !this.isEditing) {
        this.modalService.ShowError("Debe seleccionar una imagen")
        return;
      }
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('shortDescription', productData.shortDescription);
      formData.append('categoryId', productData.categoryId);

      if (this.file) {
        formData.append('imageUrl', this.file, this.file.name);
      }

      if (this.isEditing && this.currentProductId) {
        this._producServic.updateProduct(this.currentProductId, formData).subscribe({
          next: data => {
            if (data.result) {
              this.modalService.ShowSuccess(data.message);
              this.resetForm()
              this.loadProducts();
              this.isEditing = false
              this.tabGroup.selectedIndex = 0;
              this.file = null

            } else {

              this.modalService.ShowError(data.message);
            }
          },
          error: err => {
            if (err.status == 401) {
              this.logout();
            }
            this.modalService.ShowError(err.error.message);
          }
        });
        return;
      }

      this._producServic.createProduct(formData).subscribe({
        next: data => {
          if (data.result) {
            this.modalService.ShowSuccess(data.message);
            this.resetForm()
            this.loadProducts();
            this.isEditing = false
            this.tabGroup.selectedIndex = 0;
            this.file = null

          } else {

            this.modalService.ShowError(data.message);
          }
        },
        error: err => {
          if (err.status == 401) {
            this.logout();
          }
          this.modalService.ShowError(err.error.message);
        }
      });
    }
  }

  submitFormCat(): void {
    if (!this.isEditingCat) { this.categoryForm.patchValue({ status: true }); }

    if (this.categoryForm.valid) {
      const categoryData: ICategory = this.categoryForm.value;
      if (this.isEditingCat && this.currentCatId) {
        this._category.updateCategory(this.currentCatId!, categoryData).subscribe({
          next: data => {
            if (data.result) {
              this.modalService.ShowSuccess(data.message);
              this.resetFormCat()
              this.loadCategories();
              this.isEditingCat = false
              this.tabGroup.selectedIndex = 3;
            } else {
              this.modalService.ShowError(data.message);
            }
          },
          error: err => {
            if (err.status == 401) {
              this.logout();
            }
            if (err.status === 0) {
              this.modalService.ShowError('Error de conexión. Verifica tu conexión a internet.');
              return
            }
            this.modalService.ShowError(err.error.message);
          }
        });
      } else {
        this._category.createCategory(categoryData).subscribe({
          next: data => {
            if (data.result) {
              this.modalService.ShowSuccess(data.message);
              this.resetFormCat()
              this.loadCategories();
              this.isEditingCat = false
              this.tabGroup.selectedIndex = 3;
            } else {
              this.modalService.ShowError(data.message);
            }
          },
          error: err => {
            if (err.status == 401) {
              this.logout()
            }
            this.modalService.ShowError(err.error.message);
          }
        });
      }
    }
  }

  resetForm(): void {
    this.productForm.reset();
    this.isEditing = false;
    this.currentProductId = null;
    this.productForm.patchValue({
      status: true,
    });
    this.file = null
    this.previewUrl = null
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }

  }

  resetFormCat(): void {
    this.categoryForm.reset();
    this.isEditingCat = false;
    this.currentCatId = null;
    this.categoryForm.patchValue({
      isActive: true,
    });
  }

  DonwloadProd() {
    this.excel.exportProductsToExcel(this.lstProd)
  }
  DonwloadCat() {
    this.excel.exportCategoriesToExcel(this.dataSourceCat.data)
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.zone.run(() => {
        this.previewUrl = reader.result;
        this.cdr.detectChanges();
        setTimeout(() => {
          this.cdr.detectChanges();
        }, 0);
      });
    };

    reader.readAsDataURL(this.file);
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
